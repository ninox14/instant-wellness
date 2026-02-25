import { Injectable } from '@nestjs/common';
import { parse } from 'fast-csv';
import { Readable } from 'node:stream';

interface CsvRow {
  id: number;
  longitude: number;
  latitude: number;
  timestamp: Date;
  subtotal: number;
}

@Injectable()
export class FileReaderService {
  public processUploadedCsv(file: Express.Multer.File) {
    return new Promise<CsvRow[]>((resolve, reject) => {
      const rows: CsvRow[] = [];

      Readable.from(file.buffer)
        .pipe(parse({ headers: true }))
        .on('data', (row: CsvRow) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
}
