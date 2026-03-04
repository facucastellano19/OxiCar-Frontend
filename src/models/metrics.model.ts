import { z } from "zod";

const MoneyString = z
  .string()
  .or(z.number())
  .transform((val) => String(val));

export const DashboardMetricsResponseSchema = z.object({
  range: z.object({
    start: z.string(),
    end: z.string(),
    breakdown: z.enum(["daily", "weekly", "monthly", "yearly"]),
  }),
  general: z.object({
    totalRevenue: MoneyString,
    totalProductRevenue: MoneyString,
    totalServiceRevenue: MoneyString,
    totalClientsAttended: z.number(),
  }),
  breakdown: z.array(
    z.object({
      breakdown_key: z.string(),
      service_count: z.union([z.string(), z.number()]),
      product_count: z.union([z.string(), z.number()]),
      service_revenue: MoneyString,
      product_revenue: MoneyString,
    }),
  ),
  top: z.object({
    products: z.array(
      z.object({
        product: z.string(),
        quantity: z.union([z.string(), z.number()]),
      }),
    ),
    services: z.array(
      z.object({
        service: z.string(),
        quantity: z.union([z.string(), z.number()]),
      }),
    ),
    clients: z.array(
      z.object({
        client: z.string(),
        total: MoneyString,
      }),
    ),
  }),
  paymentMethods: z.array(
    z.object({
      method: z.string(),
      total: MoneyString,
    }),
  ),
});

export type DashboardMetricsResponse = z.infer<
  typeof DashboardMetricsResponseSchema
>;
