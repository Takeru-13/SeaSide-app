import LoginForm from './LoginForm';
import { useLogin } from './useLogin';
import type { LoginReq } from './types';
import { Link, useNavigate } from 'react-router-dom';
import '../auth.css';

export default function LoginSection() {
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  async function handleSubmit(data: LoginReq) {
    const u = await login(data);
    if (u) navigate('/Home');
  }

  return (
    <section>
      <div className="auth-wrap">
        <div className="auth-card">
      <h2 className="auth-title">Login</h2>
          <LoginForm onSubmit={handleSubmit} />
          {loading && <p>処理中...</p>}
          {error && <p style={{ color:'crimson' }}>{error}</p>}
        <div className="auth-alt">
          <Link to="/register" style={{ color: '#06f' }}>新規登録</Link> 
        </div>
        </div>
      </div>
      
    </section>
  );
}
