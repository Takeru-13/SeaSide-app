// frontend/src/shared/router/RootRedirect.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { tokenStorage } from '../api/http';

export default function RootRedirect() {
  const [state, setState] = useState<'checking' | 'authed' | 'guest'>('checking');

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    (async () => {
      try {
        // ★ トークンを取得 Cookieから変更
        const token = tokenStorage.get();
        
        if (!token) {
          // トークンがなければゲスト
          if (!ignore) setState('guest');
          return;
        }

        // トークンがあれば /auth/me で検証
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`, // ★ Authorizationヘッダー
          },
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
        height: '100vh',
        fontSize: '18px',
        color: '#6366f1'
      }}>
        Loading...
      </div>
    );
  }

  // ログイン済みなら /home、未ログインなら /login
  console.log("RootRedirect state:", state);
  return <Navigate to={state === 'authed' ? '/home' : '/login'} replace />;
}