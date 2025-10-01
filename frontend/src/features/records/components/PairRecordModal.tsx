// frontend/src/features/records/components/PairRecordModal.tsx
import { useEffect, useState } from 'react';
import type { RecordView, DateKey } from '../types';
import { getRecordByDate } from '../api';
import { get } from '../../../shared/api/http'

type Props = {
  /** 表示対象の日付（'YYYY-MM-DD'）。null のときは非表示 */
  date: DateKey | null;
  onClose: () => void;
  /** 可能なら親から渡す。未指定なら /pair/status で解決する */
  partnerId?: number;
};

type PairStatus = { connected: boolean; partner?: { id: number } };

export default function PairRecordModal({ date, onClose, partnerId: partnerIdProp }: Props) {
  const [record, setRecord] = useState<RecordView | null>(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<number | null>(partnerIdProp ?? null);

  // partnerId が無ければ /pair/status で解決
  useEffect(() => {
    let ignore = false;
    if (partnerIdProp != null) {
      setPartnerId(partnerIdProp);
      return;
    }
    (async () => {
      try {
        const st = await get<PairStatus>('/pair/status');
        if (!ignore && st?.connected && st?.partner?.id != null) {
          setPartnerId(st.partner.id);
        }
      } catch {
        if (!ignore) setPartnerId(null);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [partnerIdProp]);

  // ペア記録の取得（/records/:date?userId=partnerId）
  useEffect(() => {
    let ignore = false;

    async function run() {
      if (!date) return;
      if (partnerId == null) return; // 相手が未確定なら待つ
      setLoading(true);
      setErrMsg(null);

      try {
        const data = await getRecordByDate(date, String(partnerId));
        if (!ignore) setRecord(data);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('[PairRecordModal] fetch error:', msg);

        if (!ignore) {
          if (msg.startsWith('404 ')) {
            setRecord(null); // 未記録は空表示
            setErrMsg(null);
          } else if (msg.startsWith('401 ') || msg.startsWith('403 ')) {
            setRecord(null);
            setErrMsg('閲覧権限がありません（ログイン切れの可能性あり）');
          } else {
            setRecord(null);
            setErrMsg('取得時にエラーが発生しました');
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [date, partnerId]);

  if (!date) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.25)',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,.15)',
          inlineSize: 'min(720px, 100%)',
          display: 'grid',
          gap: 12,
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{date} の詳細（ペア）</h3>
          <button type="button" onClick={onClose}>
            閉じる
          </button>
        </header>

        {loading && <div>読み込み中...</div>}
        {errMsg && <div style={{ color: 'crimson' }}>{errMsg}</div>}

        {!loading && record && (
          <div style={{ display: 'grid', gap: 14 }}>
            <section>
              <strong>感情</strong>
              <div aria-label="感情スコア" style={{ fontSize: 18, fontWeight: 600 }}>
                {record.emotion} / 10
              </div>
            </section>

            <section>
              <strong>食事</strong>
              <div style={{ marginTop: 6 }}>
                <span style={{ marginRight: 6, opacity: record.meal.breakfast ? 1 : 0.5 }}>
                  朝食 {record.meal.breakfast ? '✅' : '—'}
                </span>
                <span style={{ marginRight: 6, opacity: record.meal.lunch ? 1 : 0.5 }}>
                  昼食 {record.meal.lunch ? '✅' : '—'}
                </span>
                <span style={{ opacity: record.meal.dinner ? 1 : 0.5 }}>
                  夕食 {record.meal.dinner ? '✅' : '—'}
                </span>
              </div>
            </section>

            <section>
              <strong>睡眠</strong>
              <div style={{ marginTop: 6 }}>就寝時間: {record.sleep.time || '00:00'}</div>
            </section>

            <section>
              <strong>服薬</strong>
              <div style={{ marginTop: 6 }}>
                {record.medicine.items.length > 0 ? record.medicine.items.join(' / ') : '—'}
              </div>
            </section>

            <section>
              <strong>生理</strong>
              <div style={{ marginTop: 6 }}>{record.period === 'none' ? '—' : record.period}</div>
            </section>

            <section>
              <strong>運動</strong>
              <div style={{ marginTop: 6 }}>{record.exercise.items.join(' / ') || '—'}</div>
            </section>

            <section>
              <strong>メモ</strong>
              <div style={{ marginTop: 6 }}>{record.memo.content || '—'}</div>
            </section>

            <footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose}>
                閉じる
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
