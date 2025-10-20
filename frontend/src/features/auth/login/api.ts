import { http } from '../../../shared/api/http';
import type { LoginReq, LoginRes } from './types';

export function loginApi(data: LoginReq) {
  return http<LoginRes>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}