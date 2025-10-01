// frontend/src/features/records/hooks/usePairCalendar.ts
import { useCallback, useEffect, useState } from 'react';
import { getMonthly } from '../api';
import type { MonthlyResponse, CalendarScoreDay } from '../types';

function formatYm(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export default function usePairCalendar() {
  const [ym, setYm] = useState<string>(formatYm(new Date()));
  const [days, setDays] = useState<CalendarScoreDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(
    async (targetYm: string) => {
      setLoading(true);
      setErr(null);
      try {
        const res: MonthlyResponse = await getMonthly(targetYm, 'pair');
        // BE: { ym, days: [{ date, emotion|null }] } → UI: score へ読み替え
        const mapped: CalendarScoreDay[] = (res?.days ?? []).map((d) => ({
          date: d.date,
          score: d.emotion == null ? undefined : d.emotion,
        }));
        setDays(mapped);
        // サーバ側で月が正規化された場合に同期
        if (res?.ym && res.ym !== targetYm) setYm(res.ym);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
        setDays([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    load(ym);
  }, [ym, load]);

  const prev = useCallback(() => {
    const [y, m] = ym.split('-').map(Number);
    const d = new Date(y, m - 2, 1); // 前月
    setYm(formatYm(d));
  }, [ym]);

  const next = useCallback(() => {
    const [y, m] = ym.split('-').map(Number);
    const d = new Date(y, m, 1); // 翌月
    setYm(formatYm(d));
  }, [ym]);

  return {
    scope: 'pair' as const,
    ym,
    days, // { date, score? } → Calendar / MonthlyGraph 仕様に合致
    loading,
    error: err,
    reload: () => load(ym),
    prev,
    next,
  };
}
