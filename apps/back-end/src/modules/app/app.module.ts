import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration.js';
import { OrdersModule } from '../orders/orders.module.js';
import { getConfigPath } from '../../utils/index.js';
import { DatabaseModule, DRIZZLE } from '../../db/index.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: getConfigPath(),
    }),
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DRIZZLE],
      useFactory: (db) => ({
        auth: betterAuth({
          database: drizzleAdapter(db, { provider: 'pg' }),
          emailAndPassword: { enabled: true },
        }),
      }),
    }),
    OrdersModule,
  ],
})
export class AppModule {}
