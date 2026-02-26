import { TAX_DATAElement } from '../../../types/index.js';

export interface GetTaxDataResult extends TAX_DATAElement {
  id: number;
  city: string | null;
  county: string | null;
  jurisdictions: string[];
}
