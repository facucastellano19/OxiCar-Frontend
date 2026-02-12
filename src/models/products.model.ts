import { z } from "zod";

export interface ProductCategory {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  min_stock: number;
  category_id: number;
  category?: string;
  lowStock: boolean;
  deleted_at?: string | null;
}

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  category_id: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Debes seleccionar una categoría",
    }),
  price: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val), { message: "El precio es obligatorio" })
    .refine((val) => isNaN(val) || val > 0, {
      message: "El precio debe ser mayor a 0",
    }),
  stock: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val), { message: "El stock es obligatorio" })
    .refine((val) => isNaN(val) || Number.isInteger(val), {
      message: "El stock debe ser un número entero",
    })
    .refine((val) => isNaN(val) || val >= 0, { message: "El stock no puede ser negativo" }),
  min_stock: z
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(val), { message: "El stock mínimo es obligatorio" })
    .refine((val) => isNaN(val) || Number.isInteger(val), {
      message: "El stock mínimo debe ser un número entero",
    })
    .refine((val) => isNaN(val) || val >= 0, {
      message: "El stock mínimo no puede ser negativo",
    }),
});

export type ProductForm = z.infer<typeof productSchema>;
