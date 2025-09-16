export type AuthUser = {
  id: number;
  userName: string;
  email: string;
};

export type LoginReq = {
  email: string;
  password: string;
};