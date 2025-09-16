import { useState } from 'react';
import { registerApi } from './api';
import type { AuthUser } from './types';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function register(userName: string, email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const user = await registerApi({ userName, email, password });
      return user as AuthUser;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { register, loading, error };
}
