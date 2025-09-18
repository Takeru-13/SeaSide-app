// features/home/api/index.ts
import { get, put } from '../../../shared/api/http';
import type { MonthData } from '../types';

export async function fetchMonth(ym: string, scope: 'me' | 'pair'): Promise<MonthData> {
  const days = await get<{ date: string; score?: number }[]>(
    `/records?ym=${ym}&scope=${scope}`
  );
  return { ym, days };
}


export type EditFormValue = {
  date: string;
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };
  sleep: { time: string };
  medicine: { items: string[] };
  period: 'none' | 'start' | 'during';
  emotion: number;
};

export async function updateDay(v: EditFormValue) {
  return put<{ date: string; score: number }>(`/records/${v.date}`, {
    meal: JSON.stringify(v.meal),
    sleep: JSON.stringify(v.sleep),
    medicine: JSON.stringify(v.medicine),
    period: v.period,
    emotion: v.emotion,
  });
}
