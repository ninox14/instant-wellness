import { order } from '../../schema/order.schema.js';

export type InsertOrderData = typeof order.$inferInsert;
