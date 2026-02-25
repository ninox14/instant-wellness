import { Inject, Injectable } from '@nestjs/common';
import { FileReaderService } from '../../file-reader/services/file-reader.service.js';
import { DRIZZLE, type DrizzleClient } from '../../../db/index.js';
import { sql } from 'drizzle-orm';
import { booleanPointInPolygon, point } from '@turf/turf';

@Injectable()
export class OrdersService {
  public constructor(
    private fileReader: FileReaderService,
    @Inject(DRIZZLE) private dbService: DrizzleClient,
  ) {}

  public async processUploadedCsv(file: Express.Multer.File) {
    const result = await this.fileReader.processUploadedCsv(file);
    const {
      rows: [config],
    } = await this.dbService.execute<{
      base_tax: number;
      geom_geojson: string;
    }>(
      sql`SELECT base_tax, ST_AsGeoJson(state_geom) as geom_geojson FROM config;`,
    );
    const statePolygon = JSON.parse(config.geom_geojson);
    const results = [];

    for (let i = 0; i < result.length; i++) {
      const { longitude, latitude } = result[i];

      const isInside = booleanPointInPolygon(
        point([longitude, latitude]),
        statePolygon,
      );

      if (!isInside) continue;

      const {
        rows: [data],
      } = await this.dbService.execute<{
        city: string;
        county: string;
      }>(sql`
        WITH point AS (SELECT ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326) AS geom)
        SELECT
          c.name AS city,
          co.name AS county
        FROM point p
        LEFT JOIN cities c ON ST_Contains(c.geom, p.geom)
        LEFT JOIN counties co ON ST_Contains(co.geom, p.geom)
        LIMIT 1
      `);
    }
  }
}
