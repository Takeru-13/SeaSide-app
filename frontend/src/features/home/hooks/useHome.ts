// homeの司令塔
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getMonthly, getRecordByDate, upsertRecordByDate } from '../../records/api';
import type { RecordInput, RecordView } from '../../records/types';

// 画面（カレンダー）用の型は home 側のまま
import type { MonthData, Scope } from '../types';
import type { EditFormValue } from '../components/EditModal/types';

// 月の土台を生成
function buildMonthSkeleton(ym: string): MonthData {
  const y = Number(ym.slice(0, 4));
  const m = Number(ym.slice(5, 7));
  const last = new Date(y, m, 0).getDate();

  const days = Array.from({ length: last }, (_, i) => {
    const d = new Date(y, m - 1, i + 1);
    const date = d.toISOString().slice(0, 10);
    return { date, score: undefined as number | undefined };
  });

  return { ym, days };
}

// RecordView → EditFormValue
function toEditValue(r: RecordView): EditFormValue {
  return {
    date: r.date,
    meal: (r.meal as any) ?? { breakfast: false, lunch: false, dinner: false },
    sleep: (r.sleep as any) ?? { time: '' },
    medicine: (r.medicine as any) ?? { items: [] },
    period: (r.period as any) ?? 'none',
    emotion: r.emotion ?? 5,
  };
}

// EditFormValue → RecordInput
function toInput(v: EditFormValue): RecordInput {
  return {
    meal: v.meal as any,
    sleep: v.sleep as any,
    medicine: v.medicine as any,
    period: v.period as any,
    emotion: v.emotion,
  };
}

export function useHome() {
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
      const list = await getMonthly(ym, scope);
      const map = new Map(list.map((d) => [d.date, d.score]));
      base.days.forEach((d) => (d.score = map.get(d.date)));
      setMonth(base);
    } finally {
      setLoading(false);
    }
  }, [ym, scope]);

  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const onSelectDate = useCallback(async (date: string) => {
    if (date > today) return;
    setLoading(true);
    try {
      const rec = await getRecordByDate(date);
      if (rec) {
        setEditing(toEditValue(rec));
      } else {
        setEditing({
          date,
          meal: { breakfast: false, lunch: false, dinner: false },
          sleep: { time: '' },
          medicine: { items: [] },
          period: 'none',
          emotion: 5,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [today]);

  const onSave = useCallback(async (v: EditFormValue) => {
    setLoading(true);
    try {
      await upsertRecordByDate(v.date, toInput(v));
      await load();
      setEditing(null);
    } finally {
      setLoading(false);
    }
  }, [load]);

  return {
    state: { ym, scope, month, editing, todayStr: today, loading },
    act: { setYm, setScope, onSelectDate, setEditing, onSave },
  };
}

export default useHome;
