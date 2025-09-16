import { http } from '../../../shared/api/http';
import type { AuthUser, RegisterReq } from './types';

export function registerApi(data: RegisterReq) {
  return http<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}