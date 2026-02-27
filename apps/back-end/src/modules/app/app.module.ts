import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration.js';
import { OrdersModule } from '../orders/orders.module.js';
import { getConfigPath } from '../../utils/index.js';
import { DatabaseModule } from '../../db/index.js';
import { MulterModule } from '@nestjs/platform-express';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import path from 'node:path';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { HttpExceptionFilter } from '../../utils/filters/index.js';

@Module({
  imports: [
    MulterModule.register({ dest: path.resolve(process.cwd(), 'csv-uploads') }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: getConfigPath(),
    }),
    DatabaseModule,
    OrdersModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
