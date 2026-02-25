import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration.js';
import { OrdersModule } from '../orders/orders.module.js';
import { getConfigPath } from '../../utils/index.js';
import { DatabaseModule } from '../../db/index.js';
import { MulterModule } from '@nestjs/platform-express';
import path from 'node:path';

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
})
export class AppModule {}
