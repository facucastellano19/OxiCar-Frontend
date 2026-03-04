import { create } from "zustand";
import type { UserInfo } from "../models/user.model";
import { persist } from "zustand/middleware";

interface UserState {
  isLogged: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  setUserInfo: (data: UserInfo) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLogged: false,
      token: null,
      userInfo: null,

      setUserInfo: (data) =>
        set({
          isLogged: data.login,
          token: data.token,
          userInfo: data,
        }),

      resetUser: () => {
        set({ isLogged: false, token: null, userInfo: null });
        localStorage.removeItem("user-storage");
        localStorage.removeItem("token");
      },
    }),
    {
      name: "user-storage",
    },
  ),
);
