import { publicAxios } from './axios.service';
import type { UserInfo } from '../models/user.model';
import { loadAbort } from '../utilities/loadAbort.utility';

export const loginCall = (credentials: { username: string; password: string }) => {
  const controller = loadAbort();
  return {
    call: publicAxios.post<UserInfo>('/users/login', {
      username: credentials.username,
      password: credentials.password 
    }, {
      signal: controller.signal
    }),
    controller
  };
};