// バックエンド返却＝詳細表示用（EditFormValue と同形）
export type RecordView = {
  date: string;
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };
  sleep: { time: string };
  medicine: { items: string[] };
  period: 'none' | 'start' | 'during';
  emotion: number;

  exercise: { items: string[] };
  memo: { content: string };
};


export type RecordInput = {
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };
  sleep: { time: string };
  medicine: { items: string[] };
  period: 'none' | 'start' | 'during';
  emotion: number;

  exercise: { items: string[] };
  memo: { content: string };
};

export type MonthlyDay = {
  date: string;
  emotion: number | null;
};

export type MonthlyResponse = {
  ym: string;
  days: MonthlyDay[];
};
