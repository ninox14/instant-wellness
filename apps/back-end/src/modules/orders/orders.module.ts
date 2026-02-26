import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller.js';
import { OrdersService } from './services/orders.service.js';
import { FileReaderModule } from '../file-reader/file-reader.module.js';
import { DatabaseModule } from '../../db/index.js';
import { GeocodeModule } from '../geocode/geocode.module.js';
import { TaxModule } from '../tax/tax.module.js';

@Module({
  imports: [FileReaderModule, DatabaseModule, GeocodeModule, TaxModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
