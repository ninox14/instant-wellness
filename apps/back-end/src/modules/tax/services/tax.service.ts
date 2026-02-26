import { Injectable } from '@nestjs/common';
import TAX_DATA from '../../../data/wip-tax-rates.json' with { type: 'json' };
import { TAX_DATAElement } from '../../../types/index.js';
import { GetTaxDataResult } from '../types/index.js';
import { GetGeodataResult } from '../../../db/repository/geodata/types.js';

@Injectable()
export class TaxService {
  public getTaxDataByGeodata(points: GetGeodataResult[]): GetTaxDataResult[];
  public getTaxDataByGeodata(point: GetGeodataResult): GetTaxDataResult;
  public getTaxDataByGeodata(
    pointOrPoints: GetGeodataResult | GetGeodataResult[],
  ): GetTaxDataResult | GetTaxDataResult[] {
    const IS_SINGLE_POINT = !Array.isArray(pointOrPoints);

    if (!Array.isArray(pointOrPoints)) {
      pointOrPoints = [pointOrPoints];
    }

    const result: GetTaxDataResult[] = [];

    for (const { id, county, ...other } of pointOrPoints) {
      const countyKey = `${county} County`;
      const city = other.city === 'New York' ? `New York City` : other.city;

      const key = city
        ? city === 'New York City'
          ? `${city} County`
          : city
        : countyKey;
      let foundTaxData: TAX_DATAElement = TAX_DATA[key];

      if (city && !foundTaxData) {
        foundTaxData = TAX_DATA[countyKey];
      }

      const jurisdictions: string[] = [];

      if (!foundTaxData) {
        console.log(city, county);
      }

      if (foundTaxData.isCity && city) {
        jurisdictions.push(city);
      } else if (county) {
        jurisdictions.push(county);
      }

      if (foundTaxData.mctd_included) {
        jurisdictions.push('MCTD');
      }

      result.push({ id, city, county, ...foundTaxData, jurisdictions });
    }

    return IS_SINGLE_POINT ? result[0] : result;
  }

  public calcTax(amount: number, tax: number) {
    return amount * (tax / 100);
  }

  public combinedTaxAmount(amount: number, tax: number) {
    const taxAmount = this.calcTax(amount, tax);

    return amount + taxAmount;
  }
}
