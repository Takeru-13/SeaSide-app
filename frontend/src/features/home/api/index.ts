// frontend/src/features/home/api/index.ts
// 互換レイヤー（shim）：旧 home/api から新 records/api を呼ぶ

import { getMonthly, getRecordByDate, upsertRecordByDate } from '../../records/api';
import type { RecordInput as UpdateRecordPayload, RecordView as DayRecordResponse } from '../../records/types';
import type { MonthData, Scope } from '../types';
import type { EditFormValue } from '../components/EditModal/types';

// EditFormValue -> RecordInput への変換（空要素を除去）
function toInput(v: EditFormValue): UpdateRecordPayload {
  return {
    meal: v.meal as any,
    sleep: v.sleep as any,
    medicine: {
      items: (v.medicine.items ?? []).map((s) => s.trim()).filter(Boolean),
    } as any,
    period: v.period as any,
    emotion: Number(v.emotion),
  };
}

// 月のスコア（records/api から取得）
export async function fetchMonth(ym: string, scope: Scope): Promise<MonthData> {
  const days = await getMonthly(ym, scope); // [{ date, score? }]
  return { ym, days };
}

// 単日取得（存在しない日は null）
export async function fetchDay(date: string): Promise<DayRecordResponse | null> {
  return getRecordByDate(date);
}

// 単日更新（新規/更新どちらも）
export async function updateDay(v: EditFormValue): Promise<DayRecordResponse> {
  const input = toInput(v);
  if (!Number.isInteger(input.emotion) || input.emotion < 1 || input.emotion > 10) {
    throw new Error('emotion must be an integer between 1 and 10');
  }
  return upsertRecordByDate(v.date, input);
}

// --- 互換のための型エクスポート（旧名をそのまま使っている箇所があってもビルド可にする） ---
export type { UpdateRecordPayload, DayRecordResponse };
