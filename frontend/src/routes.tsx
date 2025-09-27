import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
// import RecordDetailPage from "./pages/RecordDetailPage"; 

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Home" element={<HomePage />}></Route>
        {/* <Route path="/records/:dateKey" element={<RecordDetailPage />} /> */}

      </Routes>
    </BrowserRouter>
  );
}
