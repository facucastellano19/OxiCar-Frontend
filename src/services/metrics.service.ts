import { privateAxios } from "./axios.service";

import { 
  DashboardMetricsResponseSchema, 
  type DashboardMetricsResponse 
} from '../models/metrics.model';

export const metricsService = {
  getDashboardMetrics: async (params: {
    filter?: 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardMetricsResponse> => {
    
    const { data } = await privateAxios.get('/metrics/dashboard', { 
      params: {
        filter: params.filter,
        startDate: params.startDate,
        endDate: params.endDate
      }
    });
    const validatedData = DashboardMetricsResponseSchema.parse(data);
    
    return validatedData;
  }
};