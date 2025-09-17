// features/home/api/index.ts
import type { MonthData, EditPayload } from '../types';

// --- 本番APIに差し替える時は下2行のコメントアウトを外して get/put を使う ---
// export const fetchMonth = (ym: string, scope: 'me'|'pair') =>
//   get<MonthData>(`/records?ym=${ym}&scope=${scope}`);

export async function fetchMonth(ym: string, scope: 'me' | 'pair'): Promise<MonthData> {
  // STUB: その月に score=5 を数日分だけ入れて返す
  // scopeパラメータを利用（例: ログ出力）
  console.log(`fetchMonth called with scope: ${scope}`);
  const first = new Date(`${ym}-01`);
  const days: MonthData['days'] = [];
  for (let d = 1; d <= 31; d++) {
    const dt = new Date(first.getFullYear(), first.getMonth(), d);
    if (dt.getMonth() !== first.getMonth()) break;
    const iso = dt.toISOString().slice(0, 10);
    days.push({ date: iso, score: d % 7 === 0 ? 7 : undefined, note: '' });
  }
  return { ym, days };
}

// export const updateDay = (payload: EditPayload, scope: 'me'|'pair') =>
//   put<DaySummary>(`/records/${payload.date}?scope=${scope}`, payload);

export async function updateDay(payload: EditPayload, _scope: 'me'|'pair') {

  return { date: payload.date, score: payload.score, note: payload.note };
}
