import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { get } from '../../shared/api/http';

type MeResponse = { id: number; userName: string };

export default function RequireAuth() {
  const [ok, setOk] = useState<boolean | null>(null); // null = 判定中
  const location = useLocation();

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await get<MeResponse>('/auth/me'); // 200ならログイン済み
        if (!ignore) setOk(true);
      } catch {
        if (!ignore) setOk(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  if (ok === null) return null; // ここにスピナー等を出してもOK

  if (!ok) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
  }

  return <Outlet />; // 認証OKなら子ルートを表示
}
