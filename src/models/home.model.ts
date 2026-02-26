import { z } from "zod";

// 1. Schema for Recent Services
export const RecentServiceSchema = z.object({
  sale_id: z.number(),
  client_name: z.string(),
  sale_time: z.string(),
  sale_total: z.string(),
  service_status: z.string(),
  services: z.string(),
});

// 2. Schema for Recent Products
export const RecentProductSchema = z.object({
  sale_id: z.number(),
  client_name: z.string(),
  sale_time: z.string(),
  sale_total: z.string(),
  payment_status: z.string(),
  products: z.array(z.object({
    product_name: z.string(),
    quantity: z.number(),
    unit_price: z.string(),
    subtotal: z.string(),
  })),
});

// 3. Main Home Dashboard Schema
export const HomeDashboardResponseSchema = z.object({
  summary: z.object({
    totalSales: z.number(),
    confirmedPayments: z.string().or(z.number()),
    pendingPayments: z.string().or(z.number()),
  }),
  recentActivity: z.object({
    services: z.array(RecentServiceSchema),
    products: z.array(RecentProductSchema),
  }),
});

// Types extracted from schemas
export type RecentService = z.infer<typeof RecentServiceSchema>;
export type RecentProduct = z.infer<typeof RecentProductSchema>;
export type HomeDashboardResponse = z.infer<typeof HomeDashboardResponseSchema>;