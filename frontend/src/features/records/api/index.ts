// frontend/src/features/records/api/index.ts
import { get, put } from '../../../shared/api/http';
import type {
  DateKey,
  Scope,
  MonthlyResponse,
  RecordView,
  UpsertPayload,
} from '../types';

/** 月次（カレンダー用） */
export async function getMonthly(ym: string, scope: Scope): Promise<MonthlyResponse> {
  // ym は安全のためエンコード
  return get<MonthlyResponse>(`/records?ym=${encodeURIComponent(ym)}&scope=${scope}`);
}

/** 詳細1件：自分 or ペア（userId 指定でペア） */
export async function getRecordByDate(date: DateKey, userId?: string): Promise<RecordView | null> {
  const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  try {
    return await get<RecordView>(`/records/${date}${q}`);
  } catch (e: any) {
    // 404 は未記録として null を返す（UI 側で空表示にできる）
    if (typeof e?.message === 'string' && e.message.startsWith('404')) return null;
    throw e;
  }
}

/** 保存（自分のみ可）— 保存後は RecordView を返す */
export function upsertRecordByDate(date: DateKey, input: UpsertPayload) {
  return put<RecordView>(`/records/${date}`, input);
}

// // frontend/src/features/records/api/index.ts
// import { get, put } from '../../../shared/api/http';
// import type { MonthlyDay, UpsertPayload, RecordView } from '../types';

// export async function getMonthly(ym: string, scope: 'me' | 'pair'): Promise<MonthlyDay[]> {
//   const res = await get<unknown>(`/records?ym=${ym}&scope=${scope}`);
//   if (Array.isArray(res)) return res as MonthlyDay[];
//   if (res && typeof res === 'object' && 'days' in (res as any)) {
//     const days = (res as any).days;
//     return Array.isArray(days) ? (days as MonthlyDay[]) : [];
//   }
//   return [];
// }
// export async function getRecordByDate(date: string, scope?: 'me'|'pair'): Promise<RecordView|null> {
//   const q = scope ? `?scope=${scope}` : '';
//   try {
//     return await get<RecordView>(`/records/${date}${q}`);
//   } catch (e: any) {
//     if (typeof e?.message === 'string' && e.message.startsWith('404')) return null;
//     throw e;
//   }
// }

// export async function upsertRecordByDate(date: string, input: UpsertPayload) {
//   return put<RecordView>(`/records/${date}`, input);
// }
