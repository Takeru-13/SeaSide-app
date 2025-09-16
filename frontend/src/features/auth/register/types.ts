export type AuthUser = {
  id: number;
  userName: string;
  email: string;
};

export type RegisterReq = {
  userName: string;
  email: string;
  password: string;
  gender?: string;
};