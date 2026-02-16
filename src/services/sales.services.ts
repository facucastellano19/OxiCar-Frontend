import { privateAxios } from "./axios.service";
import { loadAbort } from "../utilities";
import type { Sale, PaymentMethod } from "../models/sales.model";

export const salesService = {
  getProductsSales: (params: { clientName?: string; startDate?: string; endDate?: string; paymentStatusId?: number } = {}) => {
    const controller = loadAbort();
    return {
      call: privateAxios.get<{ data: Sale[] }>("/sales/products", {
        params,
        signal: controller.signal,
      }),
      controller,
    };
  },

  getServicesSales: (params: { clientName?: string; startDate?: string; endDate?: string; paymentStatusId?: number; serviceStatusId?: number } = {}) => {
    const controller = loadAbort();
    return {
      call: privateAxios.get<{ data: Sale[] }>("/sales/services", {
        params,
        signal: controller.signal,
      }),
      controller,
    };
  },

  getPaymentMethods: () => {
    const controller = loadAbort();
    return {
      call: privateAxios.get<{ data: PaymentMethod[] }>("/sales/payment-methods", {
        signal: controller.signal,
      }),
      controller,
    };
  },

  postProductSale: (saleData: any) => {
    const controller = loadAbort();
    return {
      call: privateAxios.post("/sales/products", saleData, {
        signal: controller.signal,
      }),
      controller,
    };
  },

  postServiceSale: (saleData: any) => {
    const controller = loadAbort();
    return {
      call: privateAxios.post("/sales/services", saleData, {
        signal: controller.signal,
      }),
      controller,
    };
  },

  updatePaymentStatus: (id: number, payment_status_id: number) => {
    const controller = loadAbort();
    return {
      call: privateAxios.patch(`/sales/${id}/payment-status`, { payment_status_id }, {
        signal: controller.signal,
      }),
      controller,
    };
  },

  updateServiceStatus: (id: number, service_status_id: number) => {
    const controller = loadAbort();
    return {
      call: privateAxios.patch(`/sales/services/${id}/status`, { service_status_id }, {
        signal: controller.signal,
      }),
      controller,
    };
  },
};