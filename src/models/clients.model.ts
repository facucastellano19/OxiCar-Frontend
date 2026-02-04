import { z } from "zod";

export const vehicleSchema = z.object({
  brand: z.string().min(1, "La marca es obligatoria"),
  model: z.string().min(1, "El modelo es obligatorio"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, "El color es obligatorio"),
  license_plate: z.string().min(1, "La patente es obligatoria"),
});

export const clientSchema = z.object({
  first_name: z.string().min(1, "El nombre es obligatorio"),
  last_name: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(1, "El teléfono es obligatorio"),
  vehicles: z.array(vehicleSchema).default([]), 
});

export type ClientForm = z.infer<typeof clientSchema>;

export interface Client extends ClientForm {
  id: number;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}