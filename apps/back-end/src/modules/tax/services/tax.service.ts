import { Injectable } from '@nestjs/common';
import TAX_DATA from '../../../../config/wip-tax-rates.json' with { type: 'json' };

@Injectable()
export class TaxService {
  // TODO: Implement
  public getTaxDataByGeodata() {}
}
