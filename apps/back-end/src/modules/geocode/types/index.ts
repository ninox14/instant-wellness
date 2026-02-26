export type getGeodataPoint = { id: number; lan: number; lon: number };

export type GetGeodataResult = {
  id: number;
  city: string | null;
  county: string | null;
  borough: string | null;
  is_in_state: boolean | null;
  is_on_water: boolean | null;
};
