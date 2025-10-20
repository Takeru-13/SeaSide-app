// frontend/src/features/home/hooks/useHome.ts
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getMonthly, getRecordByDate, upsertRecordByDate } from '../../records/api';
import type {
  RecordView,
  UpsertPayload,
  MonthlyResponse,
  Scope,
  CalendarScoreDay,
} from '../../records/types';

// Home用のローカル便宜型（UI専用）
type MonthData = { ym: string; days: CalendarScoreDay[] };

// ローカル日付をYYYY-MM-DDに変換（UTCではなく）
function formatDateLocal(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 月の土台を生成
function buildMonthSkeleton(ym: string): MonthData {
  const y = Number(ym.slice(0, 4));
  const m = Number(ym.slice(5, 7));
  const last = new Date(y, m, 0).getDate();

  const days: CalendarScoreDay[] = Array.from({ length: last }, (_, i) => {
    const d = new Date(y, m - 1, i + 1);
    const date = formatDateLocal(d);  // ローカル時刻で日付文字列を生成
    return { date, score: undefined, tookDailyMed: false};
  });

  return { ym, days };
}

// RecordView の空デフォルト（toView と同形）
function makeEmptyView(date: string): RecordView {
  return {
    date,
    meal: { breakfast: false, lunch: false, dinner: false },
    sleep: { time: '00:00' },
    medicine: { items: [] },
    period: 'none',
    emotion: 5,
    exercise: { items: [] },
    memo: { content: '' },
  };
}

export default function useHome() {
  // ローカル時刻で今日の日付を取得（UTCではなく）
  const today = useMemo(() => formatDateLocal(new Date()), []);
  const ymInit = today.slice(0, 7);

  const [ym, setYm] = useState(ymInit);
  const [scope, setScope] = useState<Scope>('me');
  const [month, setMonth] = useState<MonthData>(() => buildMonthSkeleton(ymInit));
  const [editing, setEditing] = useState<RecordView | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const base = buildMonthSkeleton(ym);
      const raw: MonthlyResponse = await getMonthly(ym, scope);

      // API は { days: [{ date, emotion|null }] } を返す
      const pairs = (raw?.days ?? []).map((d) => {
        const val = d.emotion; // UI では emotion → score に読み替え
        const normalized: number | undefined = val == null ? undefined : val;
        return [d.date, normalized] as const;
      });

      const map = new Map<string, number | undefined>(pairs);
      const medSet = new Set<string>(
        (raw?.days ?? []).filter(d => !!d.tookDailyMed).map(d => d.date)
      );

      base.days.forEach((d) => {
        d.score = map.get(d.date);
        d.tookDailyMed = medSet.has(d.date);
      });

      setMonth(base);
    } finally {
      setLoading(false);
    }
  }, [ym, scope]);

  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const onSelectDate = useCallback(
    async (date: string) => {
      if (date > today) return;
      // ペアスコープのクリックは編集ではなく「ペア閲覧モーダル」側で扱う
      if (scope === 'pair') return;

      setLoading(true);
      try {
        const rec = await getRecordByDate(date); // 自分のみ（userId なし）
        setEditing(rec ?? makeEmptyView(date));
      } finally {
        setLoading(false);
      }
    },
    [today, scope],
  );

  // クイック編集の保存：差分パッチを受け取って PUT
  const onSaveQuick = useCallback(
    async (patch: UpsertPayload) => {
      if (!editing) return;
      setLoading(true);
      try {
        await upsertRecordByDate(editing.date, patch);
        await load();         // 保存後：月次再読込（emotion→score 反映）
        setEditing(null);     // モーダル閉じる
      } finally {
        setLoading(false);
      }
    },
    [editing, load],
  );

  return {
    state: { ym, scope, month, editing, todayStr: today, loading },
    act: { setYm, setScope, onSelectDate, setEditing, onSaveQuick },
  };
}
