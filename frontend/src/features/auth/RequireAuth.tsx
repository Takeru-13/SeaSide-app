// src/features/auth/RequireAuth.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RequireAuth() {
  const [state, setState] = useState<'checking'|'ok'|'guest'>('checking');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/me`, {
          credentials: 'include',
        });
        if (!ignore) setState(res.ok ? 'ok' : 'guest');
      } catch {
        if (!ignore) setState('guest');
      }
    })();
    return () => { ignore = true; };
  }, []);

  if (state === 'checking') return <div style={{padding:24}}>認証確認中…</div>;
  if (state === 'guest')    return <Navigate to="/register" replace />; // ← ここを /register に
  return <Outlet />;
}
