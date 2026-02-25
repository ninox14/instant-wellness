import { Module } from '@nestjs/common';
import { FileReaderService } from './services/file-reader.service.js';

@Module({
  providers: [FileReaderService],
  exports: [FileReaderService],
})
export class FileReaderModule {}
