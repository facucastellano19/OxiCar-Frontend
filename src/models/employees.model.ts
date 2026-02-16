import { z } from "zod";

export interface Employee {
  id: number;
  name: string;
  username: string;
  email: string;
  deleted_at?: string | null;
}

export const employeeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  username: z.string().min(1, "El usuario es obligatorio"),
  email: z
    .string()
    .email("El email no es válido")
    .min(1, "El email es obligatorio"),
  password: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional() 
    .refine((val) => {
      return true;
    }),
  role_id: z.any(),
  updated_by: z.any(),
});

export type EmployeeForm = z.infer<typeof employeeSchema>;
