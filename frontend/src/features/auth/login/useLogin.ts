import { useState } from "react";
import { loginApi } from './api';

import type { AuthUser, LoginReq } from './types';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: LoginReq): Promise<AuthUser | null> {
    setLoading(true);
    setError(null);

    try {
      return await loginApi(data);
    } catch (e) {
      setError((e as Error).message || 'ログインに失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}