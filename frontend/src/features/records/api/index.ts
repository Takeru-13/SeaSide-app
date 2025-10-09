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