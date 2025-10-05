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
    <SplashGate minMs={900} oncePerSession={true}>
      <BrowserRouter>
        <Header />
        <BackgroundFX />

        <Routes>
          {/* ここをRootGateに変更 */}
          <Route path="/" element={<RootGate />} />

          {/* 公開ルート */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 認証必須ルート */}
          <Route element={<RequireAuth />}>
            <Route path="/Home" element={<HomePage />} />
            <Route path="/records/:date" element={<RecordDetailPage />} />
          </Route>

          {/* 迷子は /Home に飛ばす（RequireAuthで未ログイン時は/loginへ） */}
          <Route path="*" element={<Navigate to="/Home" replace />} />
        </Routes>
      </BrowserRouter>
    </SplashGate>
  );
}
