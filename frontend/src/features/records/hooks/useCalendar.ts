// frontend/src/features/home/hooks/useHome.ts
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getMonthly, getRecordByDate, upsertRecordByDate } from '../../records/api';
import type { RecordInput, RecordView } from '../../records/types';

import type { MonthData, Scope, DaySummary } from '../types';
import type { EditFormValue } from '../components/EditModal/types';

// 月の土台を生成
function buildMonthSkeleton(ym: string): MonthData {
  const y = Number(ym.slice(0, 4));
  const m = Number(ym.slice(5, 7));
  const last = new Date(y, m, 0).getDate();

  const days: DaySummary[] = Array.from({ length: last }, (_, i) => {
    const d = new Date(y, m - 1, i + 1);
    const date = d.toISOString().slice(0, 10);
    return { date, score: undefined };
  });

  return { ym, days };
}

// RecordView → EditFormValue（★ exercise / memo を反映）
function toEditValue(r: RecordView): EditFormValue {
  return {
    date: r.date,
    meal: r.meal ?? { breakfast: false, lunch: false, dinner: false },
    sleep: r.sleep ?? { time: '' },
    medicine: r.medicine ?? { items: [] },
    period: r.period ?? 'none',
    emotion: r.emotion ?? 5,
    exercise: r.exercise ?? { items: [] },   // ★ 追加
    memo: r.memo ?? { content: '' },         // ★ 追加
  };
}

// EditFormValue → RecordInput（★ exercise / memo を反映）
function toInput(v: EditFormValue): RecordInput {
  return {
    meal: v.meal,
    sleep: v.sleep,
    medicine: v.medicine,
    period: v.period,
    emotion: v.emotion,
    exercise: v.exercise ?? { items: [] },
    memo: v.memo ?? { content: '' },
  };
}

export default function useHome() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const ymInit = today.slice(0, 7);

  const [ym, setYm] = useState(ymInit);
  const [scope, setScope] = useState<Scope>('me');
  const [month, setMonth] = useState<MonthData>(() => buildMonthSkeleton(ymInit));
  const [editing, setEditing] = useState<EditFormValue | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const base = buildMonthSkeleton(ym);

      const raw = await getMonthly(ym, scope);

      const daysFromApi: Array<{ date: string; emotion?: number | null; score?: number | null }> =
        Array.isArray(raw) ? (raw as any) : (raw as any).days ?? [];

      const pairs = daysFromApi.map((d) => {
        const val = d.score ?? d.emotion;
        const normalized: number | undefined = val == null ? undefined : val;
        return [d.date, normalized] as const;
      });

      const map = new Map<string, number | undefined>(pairs);

      base.days.forEach((d) => {
        d.score = map.get(d.date);
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
      setLoading(true);
      try {
        const rec = await getRecordByDate(date, scope);
        if (rec) {
          // ★ 取得できたらそのまま反映（逆転していたのを修正）
          setEditing(toEditValue(rec));
        } else {
          // 未記録時はデフォルト
          setEditing({
            date,
            meal: { breakfast: false, lunch: false, dinner: false },
            sleep: { time: '' },
            medicine: { items: [] },
            period: 'none',
            emotion: 5,
            exercise: { items: [] },
            memo: { content: '' },
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [today, scope],
  );

  const onSave = useCallback(
    async (v: EditFormValue) => {
      setLoading(true);
      try {
        await upsertRecordByDate(v.date, toInput(v));
        await load();
        setEditing(null);
      } finally {
        setLoading(false);
      }
    },
    [load],
  );

  return {
    state: { ym, scope, month, editing, todayStr: today, loading },
    act: { setYm, setScope, onSelectDate, setEditing, onSave },
  };
}
