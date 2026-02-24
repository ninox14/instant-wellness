import { config } from 'dotenv';
import { getConfigPath } from '../utils/index.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.js';
import { InjectionToken, Module } from '@nestjs/common';

config({ path: getConfigPath(), quiet: true });

export type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;
export const DRIZZLE: InjectionToken<DrizzleClient> = Symbol('DRIZZLE');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

        return drizzle(pool, { casing: 'snake_case', schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
