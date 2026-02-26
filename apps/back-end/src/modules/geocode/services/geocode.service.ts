import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, type DrizzleClient } from '../../../db/index.js';
import { getGeodataPoint, GetGeodataResult } from '../types/index.js';
import { sql } from 'drizzle-orm';

@Injectable()
export class GeocodeService {
  public constructor(@Inject(DRIZZLE) private dbService: DrizzleClient) {}

  public async getGeodata(
    points: getGeodataPoint[],
  ): Promise<GetGeodataResult[]>;
  public async getGeodata(point: getGeodataPoint): Promise<GetGeodataResult[]>;
  public async getGeodata(
    pointOrPoints: getGeodataPoint[] | getGeodataPoint,
  ): Promise<GetGeodataResult[]> {
    if (!Array.isArray(pointOrPoints)) {
      pointOrPoints = [pointOrPoints];
    }

    const values = sql.join(
      pointOrPoints.map(({ id, lan, lon }) => sql`(${id}, ${lon}, ${lan})`),
      sql`,`,
    );

    const { rows } = await this.dbService.execute<GetGeodataResult>(sql`
        WITH input_points(id, lon, lat) AS (VALUES ${values}),
        points AS (
          SELECT
            id,
            ST_SetSRID(ST_Point(lon::double precision, lat::double precision), 4326) AS geom
          FROM input_points
        )
        SELECT DISTINCT ON (p.id)
          p.id AS id,
          c.name AS city,
          b.name AS borough,
          co.name AS county,
          ST_Contains(cfg.state_geom, p.geom) AS is_in_state,
          ST_Contains(w.geom, p.geom) AS is_on_water
        FROM points p
        LEFT JOIN config cfg ON ST_Contains(cfg.state_geom, p.geom)
        LEFT JOIN cities c ON ST_Contains(c.geom, p.geom)
        LEFT JOIN counties co ON ST_Contains(co.geom, p.geom)
        LEFT JOIN borough b ON ST_Contains(b.geom, p.geom)
        LEFT JOIN water w ON ST_Contains(w.geom, p.geom);
    `);

    return rows;
  }
}
