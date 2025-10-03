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
          <div style={{ width:240, maxWidth:'90vw', margin:'0 auto 12px' }}>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 380" role="img" aria-label="新規登録">
      <defs>
        <path id="cardPath" d="M34,10 H286 Q310,10 310,34 V326 Q310,370 266,370 H54 Q10,370 10,326 V34 Q10,10 34,10 Z"/>
        <clipPath id="clipCard"><use href="#cardPath" /></clipPath>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7fe3ff" stopOpacity=".25"/><stop offset="1" stopColor="#b6a7ff" stopOpacity=".25"/>
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <style>
          {`.bg{fill:#9db7c0;opacity:.85}
            .avatarCircle{fill:#e8eff2;opacity:.95}
            .avatar{fill:#fff;opacity:.98}
            .horizon{stroke:#abf5ff;stroke-width:2;opacity:.72;filter:url(#softGlow)}
            .wave{fill:url(#waveGrad)}
            .label{fill:#fff;font:700 40px/1.1 "Zen Maru Gothic","M PLUS Rounded 1c","Hiragino Maru Gothic ProN","Noto Sans JP","Yu Gothic UI",system-ui,sans-serif;letter-spacing:.06em}
          `}
        </style>
      </defs>

      <use href="#cardPath" className="bg"/>
      <g clipPath="url(#clipCard)">
        <path className="horizon" d="M35,175 Q160,165 285,175" fill="none"/>
        <path className="wave" d="M-20,300 C30,288 90,312 140,298 S240,288 300,302 S360,312 340,300 L340,380 -20,380 Z"/>
      </g>

      <circle className="avatarCircle" cx="160" cy="145" r="78"/>
      <path className="avatar" d="M160 100 a30 30 0 1 1 0 60 a30 30 0 1 1 0 -60 M92 210 a68 45 0 0 1 136 0 v8 a4 4 0 0 1 -4 4 h-128 a4 4 0 0 1 -4 -4 z"/>
      <text className="label" x="160" y="305" textAnchor="middle">新規登録</text>
            </svg>
                      </div>
          <RegisterForm onSubmit={handleSubmit} />
            {loading && <p>処理中...</p>}
            {error && <p style={{ color: 'crimson' }}>{error}</p>}
          <div style={{ marginTop: 12 }}>
            <p  style={{ color: 'white' }}>
              既にアカウントをお持ちの方は{' '}
              
          </p>
        <Link to="/login"><div className="auth-alt">ログインへ</div></Link>
      </div>
      </div>
    </div>
    </section>
  );
}
