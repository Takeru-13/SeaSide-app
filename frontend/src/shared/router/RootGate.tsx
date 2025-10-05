// src/shared/router/RootGate.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { get } from '../../shared/api/http';

type MeResponse = { id: number; userName: string };

export default function RootGate() {
  const [state, setState] = useState<'checking'|'authed'|'guest'>('checking');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await get<MeResponse>('/auth/me');
        if (!ignore) setState('authed');
      } catch {
        if (!ignore) setState('guest');
      }
    })();
    return () => { ignore = true; };
  }, []);

  if (state === 'checking') return null;     // ここで Splash を出してもOK
  if (state === 'authed')  return <Navigate to="/Home" replace />;
  return <Navigate to="/login" replace />;
}
