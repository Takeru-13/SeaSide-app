// frontend/src/features/records/api/index.ts
import { get, put } from '../../../shared/api/http';
import type {
  DateKey,
  Scope,
  MonthlyResponse,
  RecordView,
  UpsertPayload,
} from '../types';

/** サーバ → 画面用の正規化（boolean を確実に揃える） */
function toView(raw: any): RecordView {
  if (!raw) return raw;
  return {
    ...raw,
    // 旧名(dailyMedTaken)が返ってくる可能性も救済しつつ boolean 化
    tookDailyMed: raw.tookDailyMed ?? raw.dailyMedTaken ?? false,
  };
}

export async function getMonthly(ym: string, scope: Scope): Promise<MonthlyResponse> {
  const res = await get<MonthlyResponse>(`/records?ym=${encodeURIComponent(ym)}&scope=${scope}`);

  // res.days を正規化（tookDailyMed を確実に boolean に）
  return {
    ym: res.ym,
    days: res.days.map((d) => ({
      date: d.date,
      emotion: d.emotion ?? null,
      tookDailyMed: !!d.tookDailyMed, //
    })),
  };
}

/** 詳細1件：自分 or ペア（userId 指定でペア） */
export async function getRecordByDate(date: DateKey, userId?: string): Promise<RecordView | null> {
  const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  try {
    const raw = await get<RecordView>(`/records/${date}${q}`);
    return toView(raw);
  } catch (e: any) {
    // 404 は未記録として null を返す（UI 側で空表示にできる）
    if (typeof e?.message === 'string' && e.message.startsWith('404')) return null;
    throw e;
  }
}

/** 保存（自分のみ可）— 保存後は RecordView を返す */
export async function upsertRecordByDate(date: DateKey, input: UpsertPayload) {
  const saved = await put<RecordView>(`/records/${date}`, input);
  return toView(saved);
}
