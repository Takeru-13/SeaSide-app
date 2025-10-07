import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BackgroundFX from "./shared/ui/BackgroundFX";
import RegisterPage from './features/auth/register/RegisterSection';
import LoginPage from './features/auth/login/LoginSection';
import HomePage from './features/records/pages/HomeSection';
import RecordDetailPage from './features/records/pages/RecordDetailSection';
import RequireAuth from './features/auth/RequireAuth';
import Header from "./shared/ui/Header";
import RootGate from "./shared/router/RootGate"; // ← 必ず <Outlet/> を返す実装に
import SplashGate from "./features/splash/SplashGate";
import "./features/splash/splash.css";

export default function AppRoutes() {
  return (
    <SplashGate minMs={900} oncePerSession>
      <BrowserRouter>
        <Header />
        <BackgroundFX />

        <Routes>
          <Route element={<RootGate />}>
            {/* 公開ルート */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* 認証必須ルート */}
            <Route element={<RequireAuth />}>
              {/* index（/）をHomeに */}
              <Route index element={<HomePage />} />
              {/* /home と /Home も受ける（直リンク対策） */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/Home" element={<HomePage />} />
              <Route path="/records/:date" element={<RecordDetailPage />} />
            </Route>
          </Route>

          {/* 迷子は / へ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SplashGate>
  );
}
