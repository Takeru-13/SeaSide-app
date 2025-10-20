// frontend/src/features/auth/register/useRegister.ts
import { useState } from 'react';
import { registerApi } from './api';
import type { AuthUser } from './types';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null); // ← unknown に変更

  async function register(userName: string, email: string, password: string, gender: string) {
    setLoading(true);
    setError(null);
    try {
      const user = await registerApi({ userName, email, password, gender });
      return user as AuthUser;
    } catch (e) {
      // ★ エラーオブジェクトをそのまま保存（Toast側で変換）
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { register, loading, error };
}