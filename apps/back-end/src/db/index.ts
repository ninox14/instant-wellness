import { config } from 'dotenv';
import { getConfigPath } from '../utils/index.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.js';
import { Module } from '@nestjs/common';
import { GeodataRepository, OrderRepository } from './repository/index.js';
import { DRIZZLE } from './constants.js';

config({ path: getConfigPath(), quiet: true });

export const createDrizzleInstance = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

  return drizzle(pool, { casing: 'snake_case', schema });
};

@Module({
  providers: [
    { provide: DRIZZLE, useFactory: createDrizzleInstance },
    OrderRepository,
    GeodataRepository,
  ],
  exports: [DRIZZLE, OrderRepository, GeodataRepository],
})
export class DatabaseModule {}
