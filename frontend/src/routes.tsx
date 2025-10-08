// src/routes.tsx （または AppRoutes.tsx）
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BackgroundFX from "./shared/ui/BackgroundFX";
import RegisterPage from './features/auth/register/RegisterSection';
import LoginPage from './features/auth/login/LoginSection';
import HomePage from './features/records/pages/HomeSection';
import RecordDetailPage from './features/records/pages/RecordDetailSection';
import RequireAuth from './features/auth/RequireAuth';
import Header from "./shared/ui/Header";
import RootGate from "./shared/router/RootGate";
import SplashGate from "./features/splash/SplashGate";
import "./features/splash/splash.css";

export default function AppRoutes() {
  return (
    <SplashGate minMs={900} oncePerSession>
      <BrowserRouter>
        <Header />
        <BackgroundFX />
        <Routes>
          {/* ここを“レイアウトルート”として全体を包む.スマホで白くなる問題改善のため。 */}
          <Route element={<RootGate />}>
            {/* 公開ルート */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* 認証必須ルート */}
            <Route element={<RequireAuth />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/records/:date" element={<RecordDetailPage />} />
            </Route>

            {/* 入口（/）と迷子（*）は /home へ */}
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SplashGate>
  );
}
