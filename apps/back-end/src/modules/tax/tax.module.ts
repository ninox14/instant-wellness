import { Module } from '@nestjs/common';
import { TaxService } from './services/tax.service.js';

@Module({
  providers: [TaxService],
  exports: [TaxService],
})
export class TaxModule {}
