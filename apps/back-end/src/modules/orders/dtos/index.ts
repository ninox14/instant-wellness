import {
  CreateOrderSchema,
  ImportCsvResponseSchema,
  OrderSchema,
} from '@/common';
import { createZodDto } from 'nestjs-zod';

export class CreateOrderRequestDTO extends createZodDto(CreateOrderSchema) {}

export class CreateOrderResponseDTO extends createZodDto(OrderSchema) {}

export class ImportOrderCsvResponseDTO extends createZodDto(
  ImportCsvResponseSchema,
) {}
