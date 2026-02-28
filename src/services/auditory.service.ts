import { privateAxios } from "./axios.service";
import {
  AuditResponseSchema,
  type AuditResponse,
  type AuditSearchParams,
} from "../models/";

export const auditService = {
  getAuditLogs: async (filters: AuditSearchParams): Promise<AuditResponse> => {
    const { data } = await privateAxios.get("/audit-log", {
      params: filters,
    });

    return AuditResponseSchema.parse(data);
  },
};
