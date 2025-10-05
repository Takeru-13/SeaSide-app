import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { get } from '../../shared/api/http';

type MeResponse = { id: number; userName: string };

// 認証不要の公開パス（必要に応じて追加）
const PUBLIC_PATHS = ['/login', '/register', '/privacy', '/terms'];

export default function RequireAuth() {
  const [ok, setOk] = useState<boolean | null>(null); // null = 判定中
  const location = useLocation();

  // 現在地が公開パスかどうか
  const isPublic = useMemo(() => {
    const p = location.pathname.toLowerCase();
    return PUBLIC_PATHS.some((base) => p === base || p.startsWith(base + '/'));
  }, [location.pathname]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        // ★ /auth/me でサーバー判定（Cookie必須）
       await get<MeResponse>('/auth/me');
        if (!ignore) setOk(true);
      } catch {
        if (!ignore) setOk(false);
      }
    })();
    return () => { ignore = true; };
    // ルート遷移のたびに判定したい場合は [location.pathname] を依存に入れてもOK
  }, []); 

  // 判定中は何も出さない（App側でSplashやスピナーを出す想定）
  if (ok === null) return null;

  // 未ログインかつ公開ページなら、そのまま閲覧可
  if (!ok && isPublic) return <Outlet />;

  // 未ログイン → /login に退避（戻り先を付与）
  if (!ok) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
  }

  // ログイン済みで /login 等に来たらホームへ返す（無限ループ防止）
  if (ok && isPublic) {
    return <Navigate to="/" replace />;
  }

  // 認証OK
  return <Outlet />;
}
