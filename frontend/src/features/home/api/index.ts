import { get, put } from '../../../shared/api/http';
import type { MonthData, Scope } from '../types'; // ← カレンダー表示用は既存のまま
import type {
  EditFormValue, UpdateRecordPayload, DayRecordResponse,
} from '../components/EditModal/types';

// 月のスコア（emotion→score の要約を使う）
export async function fetchMonth(ym: string, scope: Scope): Promise<MonthData> {
  const days = await get<{ date: string; score?: number }[]>(
    `/records?ym=${ym}&scope=${scope}`
  );
  return { ym, days };
}

export async function fetchDay(date: string): Promise<DayRecordResponse | null> {
  return get<DayRecordResponse | null>(`/records/${date}`);
}

export async function updateDay(v: EditFormValue) {
  const emotion = Number(v.emotion);
  if (!Number.isInteger(emotion) || emotion < 1 || emotion > 10) {
    throw new Error('emotion must be an integer between 1 and 10');
  }

  const payload: UpdateRecordPayload = {
    meal: v.meal,
    sleep: v.sleep,
    medicine: v.medicine,
    period: v.period,
    emotion,
  };

  return put<DayRecordResponse>(`/records/${v.date}`, payload);
}
