import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginForm = z.infer<typeof LoginSchema>;

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface UserInfo {
  login: boolean;
  token: string;
  id: number;
  username: string;
  role_id: number;
  name?: string;
}
