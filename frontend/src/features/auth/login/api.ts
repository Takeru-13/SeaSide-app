import { http } from '../../../shared/api/http';
import type { AuthUser, LoginReq } from './types';

export function loginApi(data: LoginReq) {
  return http<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}