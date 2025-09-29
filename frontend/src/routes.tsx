
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RecordDetailPage from './pages/RecordDetailPage';

import RequireAuth from './features/auth/RequireAuth';
import Header from "./features/components/Header";

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
          <Route path="/records/:dateKey" element={<RecordDetailPage />} />
        </Route>

        {/* 迷子はログインへ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
