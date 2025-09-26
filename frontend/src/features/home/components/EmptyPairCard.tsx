import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { get, post } from '../../../shared/api/http';

type InviteResponse = { code: string; expiresAt: string };
type StatusResponse =
  | { connected: false }
  | { connected: true; partner: { id: number; displayName?: string } };

export default function EmptyPairCard({ onConnected }: { onConnected?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // 招待コードの状態
  const [invite, setInvite] = useState<InviteResponse | null>(null);
  const [remainingSec, setRemainingSec] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // 接続フォーム
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // 初期：接続状態チェック（hookは常に呼ぶ）
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const st = await get<StatusResponse>('/pair/status');
        if (!ignore && st.connected) {
          setConnected(true);
          onConnected?.();
        }
      } catch {
        /* 無視 */
      }
    })();
    return () => { ignore = true; };
  }, [onConnected]);

  // カウントダウン（hookは常に呼ぶ。invite が無ければ即 return）
  useEffect(() => {
    if (!invite) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRemainingSec(0);
      return;
    }
    const endsAt = new Date(invite.expiresAt).getTime();
    const tick = () => {
      const sec = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setRemainingSec(sec);
      if (sec <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setInvite(null);
        setInfo('招待コードの有効期限が切れました。もう一度発行してください。');
      }
    };
    tick();
    timerRef.current = window.setInterval(tick, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [invite]);

  const handleInvite = useCallback(async () => {
    setLoading(true); setError(null); setInfo(null);
    try {
      const res = await post<InviteResponse>('/pair/invite', {});
      setInvite(res);
      setInfo('招待コードをコピーして相手に送ってください。');
    } catch (e: any) {
      setError(e?.message ?? '招待コードの発行に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!invite?.code) return;
    try {
      await navigator.clipboard.writeText(invite.code);
      setInfo('コピーしました！');
    } catch {
      setError('コピーに失敗しました。手動で選択してコピーしてください。');
    }
  }, [invite]);

  const handleConnect = useCallback(async () => {
    const code = codeInput.trim();
    if (!code) return;
    setLoading(true); setError(null); setInfo(null);
    try {
      await post('/pair/connect', { code });
      setInfo('ペア接続に成功しました。');
      setConnected(true);   // 状態更新（でも hooks の順序は不変）
      onConnected?.();
    } catch (e: any) {
      setError(e?.message ?? '接続に失敗しました。コードと有効期限を確認してください。');
    } finally {
      setLoading(false);
    }
  }, [codeInput, onConnected]);

  const mmss = useMemo(() => {
    const m = String(Math.floor(remainingSec / 60)).padStart(2, '0');
    const s = String(remainingSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [remainingSec]);

  // ★ ここで条件分岐：hooks は上で常に同じ順序で呼ばれている
  if (connected) return null;

  return (
    <div style={{
      border: '1px dashed #bbb',
      borderRadius: 12,
      padding: 16,
      margin: '12px 0',
      background: '#fafafa'
    }}>
      <h3 style={{ margin: 0, fontSize: 18 }}>ペアが未連携です</h3>
      <p style={{ margin: '6px 0 12px', opacity: 0.8 }}>
        どちらかが招待コードを発行し、相手がそのコードを入力して接続します。
      </p>

      {/* 招待コード発行 */}
      <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={handleInvite} disabled={loading} style={{ width: 'fit-content' }}>
          招待コードを発行
        </button>

        {invite && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'white',
            borderRadius: 8,
            border: '1px solid #ddd',
            padding: '8px 10px',
            width: 'fit-content'
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: 18, letterSpacing: 1 }}>
              {invite.code}
            </div>
            <button type="button" onClick={handleCopy} disabled={loading}>コピー</button>
            <div style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
              期限 {mmss}
            </div>
          </div>
        )}
      </div>

      {/* コード入力で接続 */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="相手の招待コード"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
          disabled={loading}
          style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button type="button" onClick={handleConnect} disabled={loading || !codeInput.trim()}>
          接続
        </button>
      </div>

      {(error || info) && (
        <div style={{ marginTop: 8, fontSize: 13, color: error ? 'crimson' : '#333' }}>
          {error ?? info}
        </div>
      )}
    </div>
  );
}
