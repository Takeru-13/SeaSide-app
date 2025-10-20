import LoginForm from './LoginForm';
import { useLogin } from './useLogin';
import type { LoginReq } from './types';
import { Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../../shared/ui/LoadingOverlay';
import Toast from '../../../shared/ui/Toast';
import '../auth.css';

export default function LoginSection() {
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  async function handleSubmit(data: LoginReq) {
    const u = await login(data);
    if (u) navigate('/home');
  }

  return (
    <section>
      <LoadingOverlay 
        isLoading={loading} 
        message="ログイン中..."
      />

      <Toast 
        message={error} 
        type="error"
        onClose={() => {}}
      />

      <div className="auth-wrap">
        <div className="auth-card">
          <div style={{ width:240, maxWidth:'90vw', margin:'0 auto 12px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 380" role="img" aria-label="ログイン">
              <defs>
                <path id="cardPathL" d="M34,10 H286 Q310,10 310,34 V326 Q310,370 266,370 H54 Q10,370 10,326 V34 Q10,10 34,10 Z"/>
                <clipPath id="clipCardL"><use href="#cardPathL" /></clipPath>
                <linearGradient id="waveGradL" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#7fe3ff" stopOpacity=".25"/>
                  <stop offset="1" stopColor="#b6a7ff" stopOpacity=".25"/>
                </linearGradient>
                <filter id="softGlowL" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <style>
                  {`.bg{fill:#9db7c0;opacity:.85}
                    .avatarCircle{fill:#e8eff2;opacity:.95}
                    .avatar{fill:#fff;opacity:.98}
                    .horizon{stroke:#abf5ff;stroke-width:2;opacity:.72;filter:url(#softGlowL)}
                    .wave{fill:url(#waveGradL)}
                    .label{fill:#fff;font:700 42px/1.1 "Zen Maru Gothic","M PLUS Rounded 1c","Hiragino Maru Gothic ProN","Noto Sans JP","Yu Gothic UI",system-ui,sans-serif;letter-spacing:.03em}
                  `}
                </style>
              </defs>
              
              <use href="#cardPathL" className="bg"/>
              <g clipPath="url(#clipCardL)">
                <path className="horizon" d="M35,175 Q160,165 285,175" fill="none"/>
                <path className="wave" d="M-20,300 C30,288 90,312 140,298 S240,288 300,302 S360,312 340,300 L340,380 -20,380 Z"/>
              </g>
              
              <circle className="avatarCircle" cx="160" cy="145" r="78"/>
              <path className="avatar" d="M160 100 a30 30 0 1 1 0 60 a30 30 0 1 1 0 -60 M92 210 a68 45 0 0 1 136 0 v8 a4 4 0 0 1 -4 4 h-128 a4 4 0 0 1 -4 -4 z"/>
              <text className="label" x="160" y="305" textAnchor="middle">ログイン</text>
            </svg>
          </div>
          
          <LoginForm onSubmit={handleSubmit} />
          
          {/* ★ モダンなリンク */}
          <div className="auth-footer">
            <p className="auth-footer-text">アカウントをお持ちでない方</p>
            <Link to="/register" className="auth-link">
              新規登録
              <span className="auth-link-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}