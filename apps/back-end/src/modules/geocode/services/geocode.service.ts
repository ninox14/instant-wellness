import { Injectable } from '@nestjs/common';
import { GetGeodataPoint } from '../types/index.js';
import { GetGeodataResult } from '../../../db/repository/geodata/types.js';
import { GeodataRepository } from '../../../db/repository/index.js';

@Injectable()
export class GeocodeService {
  public constructor(private geoDataRepository: GeodataRepository) {}

  public getGeodata(points: GetGeodataPoint[]): Promise<GetGeodataResult[]>;
  public getGeodata(point: GetGeodataPoint): Promise<GetGeodataResult[]>;
  public getGeodata(
    pointOrPoints: GetGeodataPoint[] | GetGeodataPoint,
  ): Promise<GetGeodataResult[]> {
    if (!Array.isArray(pointOrPoints)) {
      pointOrPoints = [pointOrPoints];
    }

    return this.geoDataRepository.getGeodataByPoints(pointOrPoints);
  }
}
