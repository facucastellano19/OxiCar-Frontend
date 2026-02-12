import { privateAxios } from "./axios.service";
import type { Product, ProductForm, ProductCategory } from "../models/products.model";

export const productsService = {
  getAll: async (name?: string, status: "active" | "inactive" = "active") => {
    const params: any = { status };
    if (name && name.trim() !== "") params.name = name;

    const { data } = await privateAxios.get<{ data: Product[] }>("/products", {
      params,
    });
    return data;
  },

  create: async (product: ProductForm) => {
    return await privateAxios.post("/products", product);
  },

  update: async (id: number, product: ProductForm) => {
    return await privateAxios.put(`/products/${id}`, product);
  },

  delete: async (id: number) => {
    return await privateAxios.delete(`/products/${id}`);
  },

  restore: async (id: number) => {
    return await privateAxios.patch(`/products/${id}/restore`);
  },

  getCategories: async () => {
    const { data } = await privateAxios.get<{ data: ProductCategory[] }>(
      "/products/categories"
    );
    return data;
  },
};