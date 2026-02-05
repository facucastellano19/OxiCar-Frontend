import { z } from "zod";

export const vehicleSchema = z.object({
  id: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().optional().nullable(),
  ),
  brand: z.string().min(1, "La marca es obligatoria"),
  model: z.string().min(1, "El modelo es obligatorio"),
  year: z.coerce
    .number()
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear() + 1, "El año no es válido"),
  color: z.string().min(1, "El color es obligatorio"),
  license_plate: z.string().min(1, "La patente es obligatoria"),
  deleted: z.boolean().optional(),
});

export const clientSchema = z.object({
  first_name: z.string().min(1, "El nombre es obligatorio"),
  last_name: z.string().min(1, "El apellido es obligatorio"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("El email no es válido"),
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

export interface ClientsResponse {
  message: string;
  data: Client[];
}

export interface SingleClientResponse {
  message: string;
  data: Client;
}
