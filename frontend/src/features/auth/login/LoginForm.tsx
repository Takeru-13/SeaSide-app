// src/features/auth/login/LoginForm.tsx
import { useState } from 'react';
import type { LoginReq } from './types';

type Props = { onSubmit: (d: LoginReq) => void };

export default function LoginForm({ onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e)=>{ e.preventDefault(); onSubmit({ email, password }); }}
      style={{ display:'grid', gap:10, maxWidth:360 }}
    >
      <label htmlFor="email">email</label>
      <input
        id="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <label htmlFor="password">パスワード</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password} onChange={e => setPassword(e.target.value)}
      />
      <button disabled={!email || !password}>Login</button>
    </form>
  );
}
