import {
  customType,
  index,
  integer,
  pgTable,
  serial,
} from 'drizzle-orm/pg-core';

export const config = pgTable(
  'config',
  {
    id: serial('id').primaryKey(),
    base_tax: integer().notNull(),
    state_geom: customType<{ data: string }>({
      dataType() {
        return 'geometry(MultiPolygon, 4326)';
      },
    })(),
  },
  (t) => [index('co_spatial_index').using('gist', t.state_geom)],
);
