import type {
  ClientForm,
  Client,
  ClientsResponse,
} from "../models/clients.model";
import { privateAxios } from "./axios.service";

export const clientsService = {
  getAll: async (): Promise<ClientsResponse> => {
    const { data } = await privateAxios.get<ClientsResponse>("/clients");
    return data;
  },

  create: async (clientData: ClientForm): Promise<Client> => {
    const { data } = await privateAxios.post("/clients", clientData);
    return data;
  },

};
