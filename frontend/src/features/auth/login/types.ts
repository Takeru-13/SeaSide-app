export type AuthUser = {
  id: number;
  userName: string;
  email: string;
};

export type LoginRes = {
  token: string;
  user: AuthUser;
};

export type LoginReq = {
  email: string;
  password: string;
};