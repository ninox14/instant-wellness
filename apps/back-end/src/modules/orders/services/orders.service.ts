import { BadRequestException, Injectable } from '@nestjs/common';
import { FileReaderService } from '../../file-reader/services/file-reader.service.js';
import { GeocodeService } from '../../geocode/services/geocode.service.js';
import { chunkArray } from '@/common';
import { CreateOrderRequestDTO } from '../dtos/index.js';
import { TaxService } from '../../tax/services/tax.service.js';
import { GetGeodataResult } from '../../../db/repository/geodata/types.js';
import { OrderRepository } from '../../../db/repository/index.js';
import { GetTaxDataResult } from '../../tax/types/index.js';
import { InsertOrderData } from '../../../db/repository/orders/types.js';

@Injectable()
export class OrdersService {
  public constructor(
    private fileReader: FileReaderService,
    private geoCodeService: GeocodeService,
    private taxService: TaxService,
    private orderRepository: OrderRepository,
  ) {}

  public async processUploadedCsv(file: Express.Multer.File) {
    const csvData = await this.fileReader.processUploadedCsv(file);
    const chunkedCsvData = chunkArray(csvData, 500);
    const promises: Promise<GetGeodataResult[]>[] = [];

    for (const chunk of chunkedCsvData) {
      promises.push(
        this.geoCodeService.getGeodata(
          chunk.map(({ id, latitude, longitude, subtotal, timestamp }) => ({
            id,
            subtotal,
            timestamp,
            lat: latitude,
            lon: longitude,
          })),
        ),
      );
    }

    const resolvedPromises = await Promise.all(promises);

    const filteredData = resolvedPromises.reduce((prev, curr) => {
      prev.push(...curr.filter((c) => c.is_in_state && !c.is_on_water));

      return prev;
    }, []);

    const chunkedFilteredData = chunkArray(filteredData, 500);
    const taxDataFromFilteredData: GetTaxDataResult[] = [];

    for (const chunk of chunkedFilteredData) {
      taxDataFromFilteredData.push(
        ...chunk.map((c) => this.taxService.getTaxDataByGeodata(c)),
      );
    }

    const toInsert: InsertOrderData[] = [];

    for (let i = 0; i < filteredData.length; i++) {
      const { subtotal, ts } = filteredData[i];
      const { breakdown, ...taxData } = taxDataFromFilteredData[i];

      toInsert.push({
        composite_tax: taxData.tax_rate_percentage,
        city_tax: breakdown.city_rate,
        county_rate: breakdown.county_rate,
        special_rate: breakdown.special_rate,
        state_rate: breakdown.state_tax,
        tax_amount: this.taxService.calcTax(
          subtotal,
          taxData.tax_rate_percentage,
        ),
        timestamp: ts.toString(),
        total_amount: this.taxService.combinedTaxAmount(
          subtotal,
          taxData.tax_rate_percentage,
        ),
        city: taxData.city,
        county: taxData.county,
        jurisdictions: taxData.jurisdictions,
        subtotal,
      });
    }

    const chunkedInsertData = chunkArray(toInsert, 500);
    const insertPromises: Promise<InsertOrderData[]>[] = [];

    for (const chunk of chunkedInsertData) {
      insertPromises.push(this.orderRepository.insertOrder(chunk));
    }

    const resolvedInsertPromises = await Promise.all(insertPromises);

    const count = resolvedInsertPromises.reduce((prev, curr) => {
      prev += curr.length;

      return prev;
    }, 0);

    return {
      parsedCsvRows: csvData.length,
      filteredRows: filteredData.length,
      insertedCount: count,
    };
  }

  public async createOrder({ lat, lon, subtotal }: CreateOrderRequestDTO) {
    const [data] = await this.geoCodeService.getGeodata({
      id: 0,
      lat,
      lon,
      subtotal,
      timestamp: new Date(),
    });

    if (!data.is_in_state) {
      throw new BadRequestException(
        'Provided coords are not located in NY State.',
      );
    }

    if (data.is_in_state && data.is_on_water) {
      throw new BadRequestException(
        'Provided coords are in NY State but located ON water',
      );
    }

    const { breakdown, ...taxData } = this.taxService.getTaxDataByGeodata(data);

    const [order] = await this.orderRepository.insertOrder({
      composite_tax: taxData.tax_rate_percentage,
      city_tax: breakdown.city_rate,
      county_rate: breakdown.county_rate,
      special_rate: breakdown.special_rate,
      state_rate: breakdown.state_tax,
      tax_amount: this.taxService.calcTax(
        subtotal,
        taxData.tax_rate_percentage,
      ),
      timestamp: data.ts.toString(),
      total_amount: this.taxService.combinedTaxAmount(
        subtotal,
        taxData.tax_rate_percentage,
      ),
      city: data.city,
      county: data.county,
      jurisdictions: taxData.jurisdictions,
      subtotal,
    });

    return order;
  }
}
