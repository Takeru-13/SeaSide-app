// frontend/src/features/home/api/index.ts
import { get } from '../../../shared/api/http';

export type MonthlyDay = { date: string; emotion: number | null };

// APIの戻りが配列 or {days:[]} どちらでも受けられるようにする
export async function getMonthly(ym: string, scope: 'me' | 'pair'): Promise<MonthlyDay[]> {
  const res = await get<unknown>(`/records?ym=${ym}&scope=${scope}`);

  // 形A: すでに配列
  if (Array.isArray(res)) {
    return res as MonthlyDay[];
  }
  // 形B: { days: [...] }
  if (res && typeof res === 'object' && 'days' in (res as any)) {
    const days = (res as any).days;
    return Array.isArray(days) ? (days as MonthlyDay[]) : [];
  }
  // それ以外 → 空
  return [];
}

export async function getByDate<T = unknown>(date: string, scope: 'me' | 'pair'): Promise<T> {
  return get<T>(`/records/${date}?scope=${scope}`);
}
