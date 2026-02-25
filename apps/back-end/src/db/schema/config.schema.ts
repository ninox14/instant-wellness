import { integer, serial, pgTable } from 'drizzle-orm/pg-core';

export const config = pgTable('config', {
  id: serial('id').primaryKey(),
  base_tax: integer().notNull(),
});
