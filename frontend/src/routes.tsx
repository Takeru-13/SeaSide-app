// src/routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BackgroundFX from "./shared/ui/BackgroundFX";
import RegisterPage from './features/auth/register/RegisterSection';
import LoginPage from './features/auth/login/LoginSection';
import HomePage from './features/records/pages/HomeSection';
import RecordDetailPage from './features/records/pages/RecordDetailSection';
import RequireAuth from './features/auth/RequireAuth';
import Header from "./shared/ui/Header";
import RootRedirect from "./shared/router/RootRedirect";
import SplashGate from "./features/splash/SplashGate";
import "./features/splash/splash.css";

export default function AppRoutes() {
  return (
    <SplashGate minMs={900} oncePerSession>
      <BrowserRouter>
        <Header />
        <BackgroundFX />

        <Routes>
          {/* トップは状態で振り分け（Cookie有→/home、無→/login） */}
          <Route path="/" element={<RootRedirect />} />

          {/* 公開ルート */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 認証必須ルート */}
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/records/:date" element={<RecordDetailPage />} />
          </Route>

          {/* フォールバック */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SplashGate>
  );
}
