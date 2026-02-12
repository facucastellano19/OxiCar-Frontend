import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string()
    .min(1, "El nombre es requerido")
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
});

export type ServiceForm = z.infer<typeof serviceSchema>;

export interface Service extends ServiceForm {
  category: string | undefined;
  id: number;
  category_name?: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
}