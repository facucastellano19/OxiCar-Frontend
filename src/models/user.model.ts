export interface User {
  id: number;
  email: string;
  role: string;
}

export interface UserInfo {
  login: boolean;
  token: string;
}