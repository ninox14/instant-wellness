import {
  ArgumentsHost,
  Catch,
  HttpException,
  Logger,
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration.js';
import { OrdersModule } from '../orders/orders.module.js';
import { getConfigPath } from '../../utils/index.js';
import { DatabaseModule } from '../../db/index.js';
import { MulterModule } from '@nestjs/platform-express';
import { APP_INTERCEPTOR, APP_PIPE, BaseExceptionFilter } from '@nestjs/core';
import path from 'node:path';
import {
  ZodSerializationException,
  ZodSerializerInterceptor,
  ZodValidationPipe,
} from 'nestjs-zod';
import { ZodError } from 'zod';

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
  ],
})
export class AppModule {}

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();
      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`);
      }
    }

    super.catch(exception, host);
  }
}
