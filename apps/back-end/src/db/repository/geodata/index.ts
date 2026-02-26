import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { GetGeodataResult } from './types.js';
import { GetGeodataPoint } from '../../../modules/geocode/types/index.js';
import { DRIZZLE, type DrizzleClient } from '../../constants.js';

@Injectable()
export class GeodataRepository {
  public constructor(@Inject(DRIZZLE) private dbService: DrizzleClient) {}

  public async getGeodataByPoints(
    points: GetGeodataPoint[],
  ): Promise<GetGeodataResult[]> {
    const values = sql.join(
      points.map(
        ({ id, lat, lon, subtotal, timestamp }) =>
          sql`(${id}, ${lon}, ${lat}, ${subtotal}, ${new Date(timestamp)})`,
      ),
      sql`,`,
    );

    const { rows } = await this.dbService.execute<GetGeodataResult>(sql`
        WITH input_points(id, lon, lat, subtotal, ts) AS (VALUES ${values}),
        points AS (
          SELECT
            id,
            subtotal,
            ts,
            ST_SetSRID(ST_Point(lon::double precision, lat::double precision), 4326) AS geom
          FROM input_points
        )
        SELECT DISTINCT ON (p.id)
          p.id AS id,
          p.subtotal AS subtotal,
          p.ts AS ts,
          c.name AS city,
          b.name AS borough,
          co.name AS county,
          ST_Intersects(cfg.state_geom, p.geom) AS is_in_state,
          ST_Intersects(w.geom, p.geom) AS is_on_water
        FROM points p
        LEFT JOIN config cfg ON ST_Intersects(cfg.state_geom, p.geom)
        LEFT JOIN cities c ON ST_Intersects(c.geom, p.geom)
        LEFT JOIN counties co ON ST_Intersects(co.geom, p.geom)
        LEFT JOIN borough b ON ST_Intersects(b.geom, p.geom)
        LEFT JOIN water w ON ST_Intersects(w.geom, p.geom);
    `);

    return rows;
  }
}
