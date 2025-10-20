// frontend/src/features/auth/login/useLogin.ts
import { useState } from "react";
import { loginApi } from './api'; // ← loginApi のまま（修正なし）
import { tokenStorage } from '../../../shared/api/http';
import type { AuthUser, LoginReq } from './types';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function login(data: LoginReq): Promise<AuthUser | null> {
    setLoading(true);
    setError(null);

    try {
      const result = await loginApi(data);
      // トークンをlocalStorageに保存
      tokenStorage.set(result.token);
      return result.user;
    } catch (e) {
      // エラーオブジェクトをそのまま保存（Toast側で変換）
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}