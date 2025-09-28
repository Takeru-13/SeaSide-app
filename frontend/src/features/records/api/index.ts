// frontend/src/features/records/api/index.ts
import { get, put } from '../../../shared/api/http';
import type { MonthlyDay, RecordInput, RecordView } from '../types';

export async function getMonthly(ym: string, scope: 'me' | 'pair'): Promise<MonthlyDay[]> {
  const res = await get<unknown>(`/records?ym=${ym}&scope=${scope}`);
  if (Array.isArray(res)) return res as MonthlyDay[];
  if (res && typeof res === 'object' && 'days' in (res as any)) {
    const days = (res as any).days;
    return Array.isArray(days) ? (days as MonthlyDay[]) : [];
  }
  return [];
}
export async function getRecordByDate(date: string, scope?: 'me'|'pair'): Promise<RecordView|null> {
  const q = scope ? `?scope=${scope}` : '';
  try {
    return await get<RecordView>(`/records/${date}${q}`);
  } catch (e: any) {
    if (typeof e?.message === 'string' && e.message.startsWith('404')) return null;
    throw e;
  }
}

export async function upsertRecordByDate(date: string, input: RecordInput) {
  return put<RecordView>(`/records/${date}`, input);
}
