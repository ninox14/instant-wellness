import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const config = pgTable('config', {
  id: text('id').primaryKey(),
  base_tax: integer().notNull(),
});
