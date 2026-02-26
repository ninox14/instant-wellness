import { numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const order = pgTable('orders', {
  id: serial('id').primaryKey(),
  composite_tax: numeric({ mode: 'number' }).notNull(),
  city_tax: numeric({ mode: 'number' }).notNull(),
  state_rate: numeric({ mode: 'number' }).notNull(),
  special_rate: numeric({ mode: 'number' }).notNull(),
  county_rate: numeric({ mode: 'number' }).notNull(),
  tax_amount: numeric({ mode: 'number' }).notNull(),
  total_amount: numeric({ mode: 'number' }).notNull(),
  subtotal: numeric({ mode: 'number' }).notNull(),
  jurisdictions: text().array().default([]),
  timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  city: text(),
  county: text(),
});
