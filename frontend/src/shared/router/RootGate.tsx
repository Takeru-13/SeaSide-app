// src/shared/router/RootGate.tsx
import { Outlet } from 'react-router-dom';

export default function RootGate() {
  // ここでは判定しない。必ず Outlet を返す
  return <Outlet />;
}