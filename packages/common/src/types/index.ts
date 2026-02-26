import z from "zod";

export const CreateOrderSchema = z
  .object({
    lat: z.number(),
    lon: z.number(),
    subtotal: z.number()
  })
  .required();

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;

export const OrderSchemaBreakdown = z
  .object({
    stateRate: z.number(),
    countyRate: z.number(),
    cityRate: z.number(),
    specialRates: z.number()
  })
  .required();

export const OrderSchema = z
  .object({
    compositeTax: z.number(),
    taxAmount: z.number(),
    totalAmount: z.number(),
    breakdown: OrderSchemaBreakdown,
    jurisdictions: z.array(z.string())
  })
  .required();

export type Order = z.infer<typeof OrderSchema>;
