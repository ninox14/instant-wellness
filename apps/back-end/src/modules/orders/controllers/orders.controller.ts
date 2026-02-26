import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service.js';
import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
} from '../dtos/index.js';
import { ZodResponse } from 'nestjs-zod';

@Controller('orders')
export class OrdersController {
  public constructor(private ordersService: OrdersService) {}

  @Post('import')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  public async importOrdersCsv(@UploadedFile() csv: Express.Multer.File) {
    return await this.ordersService.processUploadedCsv(csv);
  }

  @Post()
  // @ZodResponse({ type: CreateOrderResponseDTO })
  public createOrder(@Body() order: CreateOrderRequestDTO) {
    return this.ordersService.createOrder(order);
  }

  @Get()
  public getOrders() {}
}
