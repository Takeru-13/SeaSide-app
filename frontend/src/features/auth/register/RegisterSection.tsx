import { useRegister } from './useRegister';
import RegisterForm from './RegisterForm';
import type { RegisterReq } from './types';
import { Link, useNavigate } from 'react-router-dom';
import '../auth.css';

export default function RegisterSection() {
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  async function handleSubmit(data: RegisterReq) {
    const user = await register(data.userName, data.email, data.password, data.gender);
    if (user) {
      navigate('/login');
    }
  }

  return (
    <section>
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">新規登録</h2>
          <RegisterForm onSubmit={handleSubmit} />
            {loading && <p>処理中...</p>}
            {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <div style={{ marginTop: 12 }}>
        既にアカウントをお持ちの方は{' '}
        <Link to="/login"><div className="auth-alt">ログインへ</div></Link>
      </div>
      </div>
    </div>
    </section>
  );
}
