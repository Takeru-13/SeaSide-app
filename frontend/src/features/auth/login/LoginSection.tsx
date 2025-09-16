import LoginForm from './LoginForm';
import { useLogin } from './useLogin';
import type { LoginReq } from './types';
import { useNavigate } from 'react-router-dom';

export default function LoginSection() {
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  async function handleSubmit(data: LoginReq) {
    const u = await login(data);
    if (u) navigate('/mypage');
  }

  return (
    <section style={{ padding:24, maxWidth:420 }}>
      <h1>Login</h1>
      <LoginForm onSubmit={handleSubmit} />
      {loading && <p>処理中...</p>}
      {error && <p style={{ color:'crimson' }}>{error}</p>}
    </section>
  );
}
