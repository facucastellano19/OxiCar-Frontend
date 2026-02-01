import { publicAxios } from './axios.service';
import type { UserInfo } from '../models/user.model';

export const loginCall = async (credentials: { email: string; pass: string }) => {
  const response = await publicAxios.post<UserInfo>('/users/login', credentials);
  return response.data;
};