import { privateAxios } from "./axios.service";
import type { Service, ServiceForm, ServiceCategory } from "../models/";

export const servicesService = {
  getAll: async (name?: string) => {
    const params = name && name.trim() !== "" ? { name } : {};

    const { data } = await privateAxios.get<{ data: Service[] }>("/services", {
      params,
    });
    return data;
  },

  create: async (service: ServiceForm) => {
    return await privateAxios.post("/services", service);
  },

  update: async (id: number, service: ServiceForm) => {
    return await privateAxios.put(`/services/${id}`, service);
  },

  delete: async (id: number) => {
    return await privateAxios.delete(`/services/${id}`);
  },

  getCategories: async () => {
    const { data } = await privateAxios.get<{ data: ServiceCategory[] }>(
      "/services/categories",
    );
    return data;
  },

  createCategory: async (categoryName: string) => {
    return await privateAxios.post("/services/categories", {
      name: categoryName,
    });
  },
};
