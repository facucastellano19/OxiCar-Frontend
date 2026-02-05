import type {
  ClientForm,
  Client,
  ClientsResponse,
} from "../models/clients.model";
import { privateAxios } from "./axios.service";

export const clientsService = {
  getAll: async (search?: string): Promise<ClientsResponse> => {
    const { data } = await privateAxios.get<ClientsResponse>("/clients", {
      params: { search },
    });
    return data;
  },

  create: async (clientData: ClientForm): Promise<Client> => {
    const { data } = await privateAxios.post("/clients", clientData);
    return data;
  },

  update: async (id: number, clientData: ClientForm,): Promise<ClientsResponse> => {
    const { data } = await privateAxios.put<ClientsResponse>(
      `/clients/${id}`,
      clientData,
    );
    return data;
  },
};
