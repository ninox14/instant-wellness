import z from "zod";

export const CreateOrderSchema = z
  .object({
    lat: z.number(),
    lon: z.number(),
    subtotal: z.number()
  })
  .required();

export type CreateOrderRequestDTO = z.infer<typeof CreateOrderSchema>;

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

export type ImportCsvResponseDTO = z.infer<typeof ImportCsvResponseSchema>;
