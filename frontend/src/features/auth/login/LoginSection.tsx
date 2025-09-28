import LoginForm from './LoginForm';
import { useLogin } from './useLogin';
import type { LoginReq } from './types';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginSection() {
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  async function handleSubmit(data: LoginReq) {
    const u = await login(data);
    if (u) navigate('/Home');
  }

  return (
    <section style={{ padding:24, maxWidth:420 }}>
      <h1>Login</h1>
      <LoginForm onSubmit={handleSubmit} />
      {loading && <p>処理中...</p>}
      {error && <p style={{ color:'crimson' }}>{error}</p>}
            <div style={{ marginTop: 12 }}>
        アカウント未作成の方は{' '}
        <Link to="/register" style={{ color: '#06f' }}>新規登録</Link>
      </div>
    </section>
  );
}
