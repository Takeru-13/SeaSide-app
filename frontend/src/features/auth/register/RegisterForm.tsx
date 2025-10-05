import { useState } from 'react';
import type { RegisterReq } from './types';

type Props = { onSubmit: (data: RegisterReq) => void };

export default function RegisterForm({ onSubmit }: Props) {
  const [userName, setUserName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender]     = useState(''); 

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ userName, email, password, gender });
      }}
    >
      <label htmlFor="userName">ユーザーネーム</label>
      <input
        id="userName"
        placeholder="User name"
        value={userName}
        onChange={e => setUserName(e.target.value)}
      />

      <label htmlFor="email">Email</label>
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
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <label htmlFor="gender">性別</label>
      <select value={gender} onChange={e=>setGender(e.target.value)} id="gender">
        <option value="">性別を選択（任意）</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
        <option value="その他">その他</option>
      </select>
      <button disabled={!userName || !email || !password} className='registerButton'>新規登録</button>
    </form>
  );
}
