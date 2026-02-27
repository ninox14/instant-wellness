import { Inject, Injectable } from '@nestjs/common';
import { InsertOrderData } from './types.js';
import { order } from '../../schema/order.schema.js';
import { DRIZZLE, type DrizzleClient } from '../../constants.js';
import { GetOrdersQueryDTO } from '../../../modules/orders/dtos/index.js';
import { and, asc, desc, ilike, sql, SQL } from 'drizzle-orm';

@Injectable()
export class OrderRepository {
  public constructor(@Inject(DRIZZLE) private dbService: DrizzleClient) {}

  public insertOrder(data: InsertOrderData | InsertOrderData[]) {
    return Array.isArray(data)
      ? this.dbService.insert(order).values(data).returning()
      : this.dbService.insert(order).values(data).returning();
  }

  public async getOrders({ page, limit, ...filters }: GetOrdersQueryDTO) {
    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [];
    const orderByConditions: SQL[] = [];

    if (filters.city) {
      whereConditions.push(ilike(order.city, `%${filters.city}%`));
    }

    if (filters.county) {
      whereConditions.push(ilike(order.county, `%${filters.county}%`));
    }

    const filterKeys = Object.keys(filters);

    for (const key of filterKeys) {
      const sortDirection: 'asc' | 'desc' = filters[key];
      const drizzleDirection = sortDirection === 'asc' ? asc : desc;

      orderByConditions.push(drizzleDirection(order[key]));
    }

    if (filterKeys.length) {
      const key = filterKeys.pop();
      const direction = filters[key!];
      orderByConditions.push(direction(order.id));
    }

    const whereClause = whereConditions.length
      ? and(...whereConditions)
      : undefined;

    const [data, [{ count }]] = await Promise.all([
      this.dbService
        .select({
          id: order.id,
          compositeTax: order.composite_tax,
          taxAmount: order.tax_amount,
          totalAmount: order.total_amount,
          subtotal: order.subtotal,
          timestamp: sql<string>`TO_CHAR(${order.timestamp}, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`,
          breakdown: {
            stateRate: order.state_rate,
            countyRate: order.county_rate,
            cityRate: order.city_tax,
            specialRates: order.special_rate,
            jurisdictions: order.jurisdictions,
          },
          geoInfo: {
            city: order.city,
            county: order.county,
          },
        })
        .from(order)
        .orderBy(...orderByConditions)
        .where(whereClause)
        .limit(limit)
        .offset(offset),

      this.dbService
        .select({ count: sql<number>`count(*)` })
        .from(order)
        .where(whereClause),
    ]);

    const total = Number(count ?? 0);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }
}
