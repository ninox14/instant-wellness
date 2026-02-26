import { numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const order = pgTable('orders', {
  id: serial('id').primaryKey(),
  composite_tax: numeric().notNull(),
  city_tax: numeric().notNull(),
  state_rate: numeric().notNull(),
  special_rate: numeric().notNull(),
  county_rate: numeric().notNull(),
  tax_amount: numeric().notNull(),
  total_amount: numeric().notNull(),
  jurisdictions: text().array().default([]),
  timestamp: timestamp().notNull(),
});
