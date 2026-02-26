import * as z from 'zod';

export const orderFormSchema = z.object({
  latitude: z
    .number({ error: 'Latitude must be a number' })
    .min(-90, 'Minimum latitude is -90')
    .max(90, 'Maximum latitude is 90'),
  longitude: z
    .number({ error: 'Longitude must be a number' })
    .min(-180, 'Minimum longitude is -180')
    .max(180, 'Maximum longitude is 180'),
  subTotal: z
    .number({ error: 'Sub total must be a number' })
    .min(0, 'Sub total must be positive'),
});
