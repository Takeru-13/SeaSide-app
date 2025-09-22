import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMonth, updateDay } from '../api';
import type { MonthData, Scope } from '../types'; // カレンダー表示用
import type { EditFormValue } from '../components/EditModal/types'; // レコード用

export function useHome() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const ymInit = today.slice(0, 7);
  const [ym, setYm] = useState(ymInit);
  const [scope, setScope] = useState<Scope>('me');
  const [month, setMonth] = useState<MonthData>({ ym: ymInit, days: [] });
  const [editing, setEditing] = useState<EditFormValue | null>(null);

  const load = useCallback(async () => {
    const data = await fetchMonth(ym, scope);
    setMonth(data);
  }, [ym, scope]);

  useEffect(() => { load().catch(console.error); }, [load]);

  // 日付クリック → 未来は無効、過去/今日なら編集を開く（初期値はデフォルト）
  const onSelectDate = useCallback((date: string) => {
    if (date > today) return; // 未来は開かない
    setEditing({
      date,
      meal: { breakfast: false, lunch: false, dinner: false },
      sleep: { time: '' },
      medicine: { items: [] },
      period: 'none',
      emotion: 5,
    });
  }, [today]);

  const onSave = useCallback(async (v: EditFormValue) => {
    await updateDay(v);
    setEditing(null);
    await load(); // 反映
  }, [load]);

  return {
    state: { ym, scope, month, editing, todayStr: today },
    act: { setYm, setScope, onSelectDate, setEditing, onSave },
  };
}
