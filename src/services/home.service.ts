import { privateAxios } from "./axios.service";
import {
  HomeDashboardResponseSchema,
  type HomeDashboardResponse,
} from "../models/home.model";

export const homeService = {
  getHomeDashboard: async (): Promise<HomeDashboardResponse> => {
    const { data } = await privateAxios.get("/home/");

    const validatedData = HomeDashboardResponseSchema.parse(data);

    return validatedData;
  },
};
