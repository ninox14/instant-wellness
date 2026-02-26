import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/index.js';
import { InjectionToken } from '@nestjs/common';

export type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;
export const DRIZZLE: InjectionToken<DrizzleClient> = Symbol('DRIZZLE');
