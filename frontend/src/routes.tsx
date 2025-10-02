
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './features/auth/register/RegisterSection';
import LoginPage from './features/auth/login/LoginSection';
import HomePage from './features/records/pages/HomeSection';
import RecordDetailPage from './features/records/pages/RecordDetailSection';

import RequireAuth from './features/auth/RequireAuth';
import Header from "./shared/ui/Header";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* 非ログインでもOK */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ここから下は要ログイン */}
        <Route element={<RequireAuth />}>
          <Route path="/Home" element={<HomePage />} />
          <Route path="/records/:date" element={<RecordDetailPage />} />
        </Route>

        {/* 迷子はログインへ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
