import axios from "axios";
import { useUserStore } from "../store";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const publicAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const privateAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* INTERCEPTOR TO INJECT TOKEN FROM ZUSTAND STORAGE */
privateAxios.interceptors.request.use((config) => {
  const rawStorage = localStorage.getItem("user-storage");

  if (rawStorage) {
    try {
      const parsedStorage = JSON.parse(rawStorage);
      const token = parsedStorage.state?.token;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Axios Interceptor: Error parsing token", error);
    }
  }

  return config;
});

privateAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.code === "ERR_NETWORK") {
      useUserStore.getState().resetUser();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
