import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service.js';
import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  GetOrdersInfoResponseDTO,
  GetOrdersQueryDTO,
  GetOrdersResponseDTO,
  ImportOrderCsvResponseDTO,
} from '../dtos/index.js';
import { ZodResponse } from 'nestjs-zod';
import { OrderRepository } from '../../../db/repository/index.js';

@Controller('orders')
export class OrdersController {
  public constructor(
    private ordersService: OrdersService,
    private orderRepository: OrderRepository,
  ) {}

  @Post('import')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ZodResponse({ type: ImportOrderCsvResponseDTO })
  @UseInterceptors(FileInterceptor('file'))
  public importOrdersCsv(@UploadedFile() csv: Express.Multer.File) {
    return this.ordersService.processUploadedCsv(csv);
  }

  @Post()
  @ZodResponse({ type: CreateOrderResponseDTO })
  public createOrder(@Body() order: CreateOrderRequestDTO) {
    return this.ordersService.createOrder(order);
  }

  @Get()
  @ZodResponse({ type: GetOrdersResponseDTO })
  public getOrders(@Query() query: GetOrdersQueryDTO) {
    return this.orderRepository.getOrders(query);
  }

  @Get('info')
  @ZodResponse({ type: GetOrdersInfoResponseDTO })
  public getORdersInfo() {
    return this.orderRepository.getOrdersInfo();
  }

  @Delete('all')
  public async deleteAllOrders() {
    const { rowCount } = await this.orderRepository.deleteAllOrders();

    return { removed: rowCount };
  }
}
