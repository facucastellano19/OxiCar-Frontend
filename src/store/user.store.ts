import { create } from 'zustand';
import type { UserInfo } from '../models/user.model';
import { persist } from 'zustand/middleware';

interface UserState {
  isLogged: boolean; 
  token: string | null;
  setUserInfo: (data: UserInfo) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLogged: false,
      token: null,
      setUserInfo: (data) => set({ isLogged: data.login, token: data.token }),
      resetUser: () => {
        set({ isLogged: false, token: null });
        localStorage.removeItem('user-storage'); 
      },
    }),
    {
      name: 'user-storage', 
    }
  )
);