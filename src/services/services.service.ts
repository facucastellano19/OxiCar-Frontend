import { privateAxios } from "./axios.service";
import type { Service, ServiceForm, ServiceCategory } from "../models/";

export const servicesService = {
  getAll: async (name?: string, status: "active" | "inactive" = "active") => {
    const params: any = { status };
    if (name && name.trim() !== "") params.name = name;

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

  restore: async (id: number) => {
    return await privateAxios.patch(`/services/${id}/restore`);
  },

  getCategories: async () => {
    const { data } = await privateAxios.get<{ data: ServiceCategory[] }>(
      "/services/categories",
    );
    return data;
  },

  createCategory: async (category: { name: string }) => {
    return await privateAxios.post("/services/category", category);
  },

  updateCategory: async (id: number, category: { name: string }) => {
    return await privateAxios.put(`/services/category/${id}`, category);
  },

  deleteCategory: async (id: number) => {
    return await privateAxios.delete(`/services/category/${id}`);
  },

  restoreCategory: async (id: number) => {
    return await privateAxios.patch(`/services/category/${id}/restore`);
  },
};
