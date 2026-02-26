import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/index.js';
import { GeocodeService } from './services/geocode.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [GeocodeService],
  exports: [GeocodeService],
})
export class GeocodeModule {}
