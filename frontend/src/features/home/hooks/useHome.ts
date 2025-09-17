// features/home/hooks/useHome.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DaySummary, EditPayload, MonthData, Scope } from '../types';
import { fetchMonth, updateDay } from '../api';

function toYM(d: Date) {
  return d.toISOString().slice(0,7);
}

export default function useHome() {
  const [scope, setScope] = useState<Scope>('me');
  const [cursor, setCursor] = useState<Date>(new Date()); // カレンダー表示中の月
  const ym = useMemo(() => toYM(cursor), [cursor]);

  const [data, setData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<DaySummary | null>(null);

  // 月データのロード
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMonth(ym, scope);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [ym, scope]);

  useEffect(() => { load(); }, [load]);

  // 月移動
  const nextMonth = useCallback(() => {
    setCursor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);
  const prevMonth = useCallback(() => {
    setCursor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  // 編集開始
  const startEdit = useCallback((dateISO: string) => {
    const current = data?.days.find((d: DaySummary) => d.date === dateISO) ?? { date: dateISO };
    setEditTarget(current);
  }, [data]);

  // 保存（optimistic）
  const save = useCallback(async (payload: EditPayload) => {
    if (!data) return;
    // optimistic
    const backup = data;
    const updatedDays = data.days.map((d: DaySummary) => d.date === payload.date ? { ...d, ...payload } : d);
    if (!updatedDays.find((d: DaySummary) => d.date === payload.date)) {
      updatedDays.push({ date: payload.date, score: payload.score, note: payload.note });
    }
    setData({ ...data, days: updatedDays });

    try {
      await updateDay(payload, scope);
    } catch (e) {
      // rollback
      setData(backup);
      throw e;
    } finally {
      setEditTarget(null);
    }
  }, [data, scope]);

  return {
    state: { scope, ym, data, loading, editTarget },
    actions: { setScope, nextMonth, prevMonth, startEdit, save, reload: load, setEditTarget },
  };
}
