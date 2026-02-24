import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller.js';
import { OrdersService } from './services/orders.service.js';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [],
})
export class OrdersModule {}
