import { publicAxios } from './axios.service';
import type { UserInfo } from '../models/user.model';

export const loginCall = async (credentials: { email: string; pass: string }) => {

  const controller = new AbortController();
  return (
    {
        call: await publicAxios.post<UserInfo>('/users/login', credentials, { signal: controller.signal }),
        controller
    }
  )
};