// frontend/src/features/home/components/CalendarWithPairModal.tsx
import { useCallback, useMemo, useState } from 'react';
import CalendarView from './sections/Calendar';
import EditModal from './EditModal';
import PairRecordModal from './PairRecordModal';

// ✅ 型は“正”の場所からだけ import
import type {
  Scope,
  DateKey,
  CalendarScoreDay,
  RecordView,
  UpsertPayload,
} from '../types';

type Props = {
  scope: Scope;                    // 'me' | 'pair'
  ym: string;                      // 例: '2025-09'
  days: CalendarScoreDay[];        // 例: [{ date: '2025-09-28', score: 7 }, ...]
  onPrev?: () => void;
  onNext?: () => void;
  /**
   * 自分の記録保存（PUT /records/:date）
   * - クイック編集は差分パッチを送る設計
   */
  onSave?: (date: DateKey, patch: UpsertPayload) => Promise<void>;
  /**
   * 自分の記録を事前ロード（任意）
   * - 返り値は toView と同形の RecordView
   */
  loadSelfRecord?: (date: DateKey) => Promise<RecordView | null>;
};

export default function CalendarWithPairModal({
  scope,
  ym,
  days,
  onPrev,
  onNext,
  onSave,
  loadSelfRecord,
}: Props) {
  const isPair = scope === 'pair';

  // 自分用（編集可能）モーダル：現在値の完全形（RecordView）を保持
  const [editValue, setEditValue] = useState<RecordView | null>(null);
  // ペア用（閲覧専用）モーダル
  const [pairDate, setPairDate] = useState<DateKey | null>(null);

  // 空の既定値（toView と同形）
  const makeEmpty = useCallback(
    (date: DateKey): RecordView => ({
      date,
      meal: { breakfast: false, lunch: false, dinner: false },
      sleep: { time: '00:00' },
      medicine: { items: [] },
      period: 'none',
      emotion: 5,
      exercise: { items: [] },
      memo: { content: '' },
    }),
    [],
  );

  const handlePick = useCallback(
    async (date: DateKey) => {
      if (isPair) {
        // ペア → 専用モーダル（中でGETして表示）
        setPairDate(date);
        return;
      }
      // 自分 → 編集モーダルを開く（事前ロードあれば使う）
      let v: RecordView | null = null;
      if (loadSelfRecord) {
        try {
          v = await loadSelfRecord(date);
        } catch {
          /* noop */
        }
      }
      setEditValue(v ?? makeEmpty(date));
    },
    [isPair, loadSelfRecord, makeEmpty],
  );

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
        onPick={onPick}      // DateKey を受け渡し
        onPrev={safeOnPrev}
        onNext={safeOnNext}
      />

      {/* 自分：編集モーダル（差分パッチで保存） */}
      <EditModal
        value={editValue}                     // RecordView | null
        onClose={() => setEditValue(null)}
        onSave={async (patch: UpsertPayload) => {
          if (onSave && editValue) {
            await onSave(editValue.date as DateKey, patch);
          }
          setEditValue(null);
        }}
      />

      {/* ペア：閲覧専用モーダル */}
      <PairRecordModal
        date={pairDate}
        onClose={() => setPairDate(null)}
      />
    </>
  );
}
