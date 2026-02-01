// src/store/user.store.ts
import { create } from 'zustand';
import type { UserInfo, User } from '../models/user.model';

interface UserState {
  user: User | null;
  token: string | null;
  setUserInfo: (data: UserInfo) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUserInfo: (data) => set({ user: data.user, token: data.token }),
  resetUser: () => set({ user: null, token: null }),
}));