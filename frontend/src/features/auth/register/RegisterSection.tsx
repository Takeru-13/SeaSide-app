import { useRegister } from './useRegister';
import RegisterForm from './RegisterForm';
import type { RegisterReq } from './types';
import { useNavigate } from 'react-router-dom';

export default function RegisterSection() {
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  async function handleSubmit(data: RegisterReq) {
    const user = await register(data.userName, data.email, data.password);
    if (user) {
      navigate('/login');
    }
  }

  return (
    <section>
      <h1>Register</h1>
      <RegisterForm onSubmit={handleSubmit} />
      {loading && <p>処理中...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </section>
  );
}
