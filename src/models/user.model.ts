export interface User {
  id: number;
  email: string;
  role: string;
}

export interface UserInfo {
  user: User;
  token: string;
}