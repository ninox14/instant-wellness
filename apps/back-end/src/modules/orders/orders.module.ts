import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller.js';
import { OrdersService } from './services/orders.service.js';
import { FileReaderModule } from '../file-reader/file-reader.module.js';
import { DatabaseModule } from '../../db/index.js';

@Module({
  imports: [FileReaderModule, DatabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [],
})
export class OrdersModule {}
