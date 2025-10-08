// src/routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BackgroundFX from "./shared/ui/BackgroundFX";
import RegisterPage from './features/auth/register/RegisterSection';
import LoginPage from './features/auth/login/LoginSection';
import HomePage from './features/records/pages/HomeSection';
import RecordDetailPage from './features/records/pages/RecordDetailSection';
import RequireAuth from './features/auth/RequireAuth';
import Header from "./shared/ui/Header";
import RootGate from "./shared/router/RootGate";
import RootRedirect from "./shared/router/RootRedirect"; // ← 追加
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
            {/* 公開 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 認証必須 */}
            <Route element={<RequireAuth />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/records/:date" element={<RecordDetailPage />} />
              <Route path="/Home" element={<Navigate to="/home" replace />} />
            </Route>

            {/* ルートパスは認証状態で振り分け */}
            <Route index element={<RootRedirect />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SplashGate>
  );
}