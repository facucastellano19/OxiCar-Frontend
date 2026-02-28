import { z } from "zod";

export const AuditLogSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable(),
  username: z
    .string()
    .nullable()
    .transform((val) => val ?? "Sistema"),
  action_type: z.string(),
  entity_type: z.string().nullable(),
  entity_id: z.number().nullable(),
  changes: z.any().nullable().optional(),
  status: z.string(),
  error_message: z.string().nullable(),
  ip_address: z.string().nullable(),
  created_at: z.string(),
});

export const AuditResponseSchema = z.object({
  message: z.string(),
  data: z.array(AuditLogSchema),
});
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditResponse = z.infer<typeof AuditResponseSchema>;

export interface AuditSearchParams {
  userId?: number;
  username?: string;
  actionType?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}
