import { index, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { customType } from 'drizzle-orm/pg-core';

const multiPolygon = customType<{ data: string }>({
  dataType() {
    return 'geometry(MultiPolygon, 4326)';
  },
});

export const counties = pgTable(
  'counties',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    geom: multiPolygon(),
  },
  (t) => [index('c_spatial_index').using('gist', t.geom)],
);

export const cities = pgTable(
  'cities',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    geom: multiPolygon(),
  },
  (t) => [index('ci_spatial_index').using('gist', t.geom)],
);

export const borough = pgTable(
  'borough',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    geom: multiPolygon(),
  },
  (t) => [index('b_spatial_index').using('gist', t.geom)],
);

export const water = pgTable(
  'water',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    geom: multiPolygon(),
  },
  (t) => [index('w_spatial_index').using('gist', t.geom)],
);
