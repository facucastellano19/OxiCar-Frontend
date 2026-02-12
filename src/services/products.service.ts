import { privateAxios } from "./axios.service";
import type { Product, ProductForm, ProductCategory } from "../models/products.model";

export const productsService = {
  getAll: async (name?: string, status: "active" | "inactive" | "all" = "active", category_id?: number) => {
    const params: any = { status };
    if (name && name.trim() !== "") params.name = name;
    if (category_id) params.category_id = category_id;

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

  getCategories: async (status: "active" | "inactive" | "all" = "active") => {
    const { data } = await privateAxios.get<{ data: ProductCategory[] }>(
      "/products/categories",
      { params: { status } }
    );
    return data;
  },

  createCategory: async (category: { name: string }) => {
    return await privateAxios.post("/products/category", category);
  },

  updateCategory: async (id: number, category: { name: string }) => {
    return await privateAxios.put(`/products/category/${id}`, category);
  },

  deleteCategory: async (id: number) => {
    return await privateAxios.delete(`/products/category/${id}`);
  },

  restoreCategory: async (id: number) => {
    return await privateAxios.patch(`/products/category/${id}/restore`);
  },
};