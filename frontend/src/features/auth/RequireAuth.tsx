// src/features/auth/RequireAuth.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { tokenStorage } from '../../shared/api/http';

export default function RequireAuth() {
  const [state, setState] = useState<'checking'|'ok'|'guest'>('checking');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const token = tokenStorage.get();
        if (!token) {
          if (!ignore) setState('guest');
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!ignore) {
          if (res.ok) {
            setState('ok');
          } else {
            // トークンが無効な場合はクリア
            tokenStorage.clear();
            setState('guest');
          }
        }
      } catch {
        if (!ignore) {
          tokenStorage.clear();
          setState('guest');
        }
      }
    })();
    return () => { ignore = true; };
  }, []);

  if (state === 'guest')    return <Navigate to="/login" replace />;
  return <Outlet />;
}
