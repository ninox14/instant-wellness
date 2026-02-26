import { Injectable } from '@nestjs/common';
import { FileReaderService } from '../../file-reader/services/file-reader.service.js';
import { GeocodeService } from '../../geocode/services/geocode.service.js';
import { GetGeodataResult } from '../../geocode/types/index.js';
import { chunkArray } from '../../../utils/index.js';

@Injectable()
export class OrdersService {
  public constructor(
    private fileReader: FileReaderService,
    private geoCodeService: GeocodeService,
  ) {}

  public async processUploadedCsv(file: Express.Multer.File) {
    const csvData = await this.fileReader.processUploadedCsv(file);
    const chunkedCsvData = chunkArray(csvData, 100);
    const promises: Promise<GetGeodataResult[]>[] = [];

    for (const chunk of chunkedCsvData) {
      promises.push(
        this.geoCodeService.getGeodata(
          chunk.map((c) => ({ id: c.id, lan: c.latitude, lon: c.longitude })),
        ),
      );
    }

    const resolvedPromises = await Promise.all(promises);

    const results = resolvedPromises.reduce((prev, curr) => {
      prev.push(...curr);

      return prev;
    }, []);

    const notInState = results.filter((r) => !r.is_in_state).length;
    const inStateButOnWater = results.filter(
      (r) => r.is_in_state && r.is_on_water,
    ).length;
    const inStateAndNotOnWater = results.filter(
      (r) => r.is_in_state && !r.is_on_water,
    ).length;
    const notInStateAndNotOnWater = results.filter(
      (r) => !r.is_in_state && !r.is_on_water,
    ).length;
    const inNYCBoroughs = results.filter((r) => r.borough).length;

    return {
      importedRows: csvData.length,
      notInState,
      inStateButOnWater,
      inStateAndNotOnWater,
      inNYCBoroughs,
      notInStateAndNotOnWater,
      t: results.length,
    };
  }

  public createOrder() {}
}
