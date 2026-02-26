import { Inject, Injectable } from '@nestjs/common';
import { InsertOrderData } from './types.js';
import { order } from '../../schema/order.schema.js';
import { DRIZZLE, type DrizzleClient } from '../../constants.js';

@Injectable()
export class OrderRepository {
  public constructor(@Inject(DRIZZLE) private dbService: DrizzleClient) {}

  public insertOrder(data: InsertOrderData | InsertOrderData[]) {
    return Array.isArray(data)
      ? this.dbService.insert(order).values(data).returning()
      : this.dbService.insert(order).values(data).returning();
  }
}
