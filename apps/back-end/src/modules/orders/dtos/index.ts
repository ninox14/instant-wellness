import {
  CreateOrderSchema,
  GetOrdersFiltersSchema,
  GetOrdersInfoResponseSchema,
  GetOrdersReturnSchema,
  ImportCsvResponseSchema,
  OrderSchema,
} from '@/common';
import { createZodDto } from 'nestjs-zod';

export class CreateOrderRequestDTO extends createZodDto(CreateOrderSchema) {}

export class CreateOrderResponseDTO extends createZodDto(OrderSchema) {}

export class ImportOrderCsvResponseDTO extends createZodDto(
  ImportCsvResponseSchema,
) {}

export class GetOrdersQueryDTO extends createZodDto(GetOrdersFiltersSchema) {}

export class GetOrdersResponseDTO extends createZodDto(GetOrdersReturnSchema) {}

export class GetOrdersInfoResponseDTO extends createZodDto(
  GetOrdersInfoResponseSchema,
) {}
