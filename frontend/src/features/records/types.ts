export type DateKey = string;           // 'YYYY-MM-DD'
export type Scope = 'me' | 'pair';

export type MonthlyDay = { date: DateKey; emotion: number | null };
export type MonthlyResponse = { ym: string; days: MonthlyDay[] };

// UI便宜型（グラフ/カレンダー用）
export type CalendarScoreDay = { date: DateKey; score?: number };

// 詳細表示（BE toView と同形）
export type RecordView = {
  date: DateKey;
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };
  sleep: { time: string };
  medicine: { items: string[] };
  period: 'none' | 'start' | 'during';
  emotion: number;                      // 1..10

  tookDailyMed: boolean;

  exercise: { items: string[] };
  memo: { content: string };
};

// 保存Payload（クイックでも流用：全部optional）
export type UpsertPayload = {
  meal?: { breakfast?: boolean; lunch?: boolean; dinner?: boolean };
  sleep?: { time?: string };
  medicine?: { items?: string[] };
  period?: 'none' | 'start' | 'during';
  emotion?: number;                     // 1..10

  tookDailyMed?: boolean;

  exercise?: { items?: string[] };
  memo?: { content?: string };
};
