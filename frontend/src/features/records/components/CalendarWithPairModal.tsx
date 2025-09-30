// frontend/src/features/home/components/CalendarWithPairModal.tsx
import { useCallback, useMemo, useState } from 'react';
import CalendarView from './Calendar/Calendar';
import EditModal from './EditModal/EditModal';
import PairDetailModal from './PairDetailModal';
import type { EditFormValue } from './EditModal/types';

type Scope = 'me' | 'pair';
type Day = { date: string; score?: number };

export default function CalendarWithPairModal({
  scope,
  ym,
  days,
  onPrev,
  onNext,
  onSave,                 // 自分の記録保存 (PUT /records/:date など)
  loadSelfRecord,         // 自分の記録を事前ロードしたい場合に注入（任意）
}: {
  scope: Scope;
  ym: string;             // 例: '2025-09'
  days: Day[];            // 例: [{ date: '2025-09-28', score: 7 }, ...]
  onPrev?: () => void;
  onNext?: () => void;
  apiBase?: string;
  onSave?: (v: EditFormValue) => Promise<void>;
  loadSelfRecord?: (date: string) => Promise<EditFormValue | null>;
}) {
  const isPair = scope === 'pair';

  // 自分用（編集可能）モーダル
  const [editValue, setEditValue] = useState<EditFormValue | null>(null);
  // ペア用（閲覧専用）モーダル
  const [pairDate, setPairDate] = useState<string | null>(null);

  const makeEmpty = useCallback((date: string): EditFormValue => ({
    date,
    meal: { breakfast: false, lunch: false, dinner: false },
    sleep: { time: '00:00' },
    medicine: { items: [] },
    period: 'none',
    emotion: 5,
    exercise: { items: [] },  // 追加
    memo: { content: '' },    // 追加
  }), []);

  const handlePick = useCallback(async (date: string) => {
    if (isPair) {
      // ペア → 専用モーダル（中でGETして表示）
      setPairDate(date);
      return;
    }
    // 自分 → 編集モーダル
    let v: EditFormValue | null = null;
    if (loadSelfRecord) {
      try { v = await loadSelfRecord(date); } catch { /* noop */ }
    }
    setEditValue(v ?? makeEmpty(date));
  }, [isPair, loadSelfRecord, makeEmpty]);

  const onPick = useMemo(() => handlePick, [handlePick]);

  // CalendarView 側の prop が必須の場合に備えて常に関数を渡す
  const noop = useMemo(() => () => {}, []);
  const safeOnPrev = onPrev ?? noop;
  const safeOnNext = onNext ?? noop;

  return (
    <>
      <CalendarView
        ym={ym}
        days={days}
        onPick={onPick}      // ← HomeのCalendar.tsx と同じAPI（onPick）
        onPrev={safeOnPrev}  // ← 必ず関数を渡す
        onNext={safeOnNext}  // ← 必ず関数を渡す
      />

      {/* 自分：編集モーダル */}
      <EditModal
        value={editValue}
        onClose={() => setEditValue(null)}
        onSave={async (v) => {
          if (onSave) await onSave(v);
          setEditValue(null);
        }}
      />

      {/* ペア：閲覧専用モーダル */}
      <PairDetailModal
        date={pairDate}
        onClose={() => setPairDate(null)}
      />
    </>
  );
}
