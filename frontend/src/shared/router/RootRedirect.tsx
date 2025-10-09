// src/shared/router/RootRedirect.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function RootRedirect() {
  const [state, setState] = useState<'checking' | 'authed' | 'guest'>('checking');

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: 'include',
          signal: controller.signal,
        });
        if (!ignore) setState(res.ok ? 'authed' : 'guest');
      } catch {
        if (!ignore) setState('guest');
      }
    })();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  if (state === 'checking') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  // ログイン済みなら /home、未ログインなら /login
  console.log("RequireAuth state:", state);
  return <Navigate to={state === 'authed' ? '/home' : '/login'} replace />;
}