export interface SaleProduct {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface SaleServiceItem {
  service_id: number;
  service_name: string;
  price: number;
}

export interface Sale {
  sale_id: number;
  client_name: string;
  sale_total: number;
  payment_method: string;
  payment_status: string;
  service_status?: string;
  observations: string;
  created_at: string;
  completed_at: string;
  cancelled_at: string;
  started_at: string;
  payment_cancelled_at: string;
  paid_at: string;
  products?: SaleProduct[];
  services?: SaleServiceItem[];
  vehicle?: {
    brand: string;
    model: string;
    license_plate: string;
  };
}

export interface PaymentMethod {
  id: number;
  name: string;
}

export interface SaleProductForm {
  client_id: number;
  payment_method_id: number;
  payment_status_id?: number;
  observations?: string;
  products: {
    product_id: number;
    quantity: number;
  }[];
}

export interface SaleServiceForm {
  client_id: number;
  vehicle_id: number;
  payment_method_id: number;
  payment_status_id?: number;
  observations?: string;
  services: {
    service_id: number;
  }[];
}

import { z } from "zod";

export const productSaleSchema = z.object({
  client_id: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Debe seleccionar un cliente",
    }),
  payment_method_id: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Seleccione un método de pago",
    }),
  observations: z.string().optional(),
  products: z
    .array(
      z.object({
        product_id: z.number().min(1, "ID de producto inválido"),
        quantity: z
          .number()
          .or(z.nan())
          .refine((val) => !isNaN(val), {
            message: "La cantidad es obligatoria",
          })
          .refine((val) => val >= 1, { message: "Mínimo: 1" }),
      }),
    )
    .min(1, "Debe agregar al menos un producto"),
});

export const serviceSaleSchema = z.object({
  client_id: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Debe seleccionar un cliente",
    }),
  vehicle_id: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Debe seleccionar un vehículo",
    }),
  payment_method_id: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Seleccione un método de pago",
    }),
  observations: z.string().optional(),
  services: z
    .array(
      z.object({
        service_id: z.number().min(1, "ID de servicio inválido"),
      }),
    )
    .min(1, "Debe agregar al menos un servicio"),
});
