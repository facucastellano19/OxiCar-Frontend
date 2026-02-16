import { privateAxios } from "./axios.service";
import type { Employee, EmployeeForm } from "../models/employees.model";

export const employeesService = {
  getAll: async (name?: string, status: "active" | "inactive" = "active") => {
    const params: any = { status };
    if (name && name.trim() !== "") params.name = name;

    const { data } = await privateAxios.get<{ data: Employee[] }>("/employees", {
      params,
    });
    return data;
  },

  create: async (employee: EmployeeForm) => {
    return await privateAxios.post("/employees", employee);
  },

  update: async (id: number, employee: EmployeeForm) => {
    return await privateAxios.put(`/employees/${id}`, employee);
  },

  delete: async (id: number) => {
    return await privateAxios.delete(`/employees/${id}`);
  },

  restore: async (id: number) => {
    return await privateAxios.patch(`/employees/${id}/restore`);
  },
};