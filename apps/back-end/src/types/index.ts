export interface TAX_DATAElement {
  locality: string;
  tax_rate_percentage: number;
  reporting_code: string;
  mctd_included: boolean;
  original_locality: string;
  isCity: boolean;
  breakdown: TAX_DATABreakdownElement;
}

export interface TAX_DATABreakdownElement {
  state_tax: number;
  city_rate: number;
  county_rate: number;
  special_rate: number;
}
