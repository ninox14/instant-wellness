import z from "zod";

export const CreateOrderSchema = z
  .object({
    lat: z.number(),
    lon: z.number(),
    subtotal: z.number()
  })
  .required();

export const OrderSchemaBreakdown = z
  .object({
    stateRate: z.number(),
    countyRate: z.number(),
    cityRate: z.number(),
    specialRates: z.number(),
    jurisdictions: z.array(z.string()).nullable()
  })
  .required();

export const OrderSchemaGeoInfo = z
  .object({ city: z.string().nullable(), county: z.string().nullable() })
  .required();

export const OrderSchema = z
  .object({
    id: z.number(),
    compositeTax: z.number(),
    taxAmount: z.number(),
    totalAmount: z.number(),
    subtotal: z.number(),
    timestamp: z.iso.datetime(),
    breakdown: OrderSchemaBreakdown,
    geoInfo: OrderSchemaGeoInfo
  })
  .required();

export type Order = z.infer<typeof OrderSchema>;

export const ImportCsvResponseSchema = z
  .object({
    parsedCsvRows: z.number(),
    filteredRows: z.number(),
    insertedCount: z.number()
  })
  .required();

const SORT_DIRECTIONS = ["asc", "desc"];

export const GetOrdersFiltersSchema = z.object({
  page: z.coerce.number().min(1).int().default(1),
  limit: z.coerce.number().min(1).int().default(100),
  composite_tax: z.enum(SORT_DIRECTIONS).optional(),
  city_tax: z.enum(SORT_DIRECTIONS).optional(),
  state_rate: z.enum(SORT_DIRECTIONS).optional(),
  special_rate: z.enum(SORT_DIRECTIONS).optional(),
  county_rate: z.enum(SORT_DIRECTIONS).optional(),
  tax_amount: z.enum(SORT_DIRECTIONS).optional(),
  total_amount: z.enum(SORT_DIRECTIONS).optional(),
  subtotal: z.enum(SORT_DIRECTIONS).optional(),
  timestamp: z.enum(SORT_DIRECTIONS).optional(),
  city: z.string().optional(),
  county: z.string().optional()
});

export const PaginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number()
});

export const GetOrdersReturnSchema = z.object({
  meta: PaginationMetaSchema,
  data: z.array(OrderSchema)
});

/**
 * Request types:
 */

// Use this type to know how to construct query for GET /orders/
export type GetOrdersFiltersRequestDTO = z.infer<typeof GetOrdersFiltersSchema>;

// Use this type to know what to include in body for POST /orders/
export type CreateOrderRequestDTO = z.infer<typeof CreateOrderSchema>;

/**
 * Response types:
 */

// Misc type if you will need it, specifies meta field returned by GET /orders/ contains pagination information
export type PaginationMetaDTO = z.infer<typeof PaginationMetaSchema>;

// Return type for GET /orders/
export type GetOrdersResponseDTO = z.infer<typeof GetOrdersReturnSchema>;

// Return type for POST /orders/import
export type ImportCsvResponseDTO = z.infer<typeof ImportCsvResponseSchema>;
