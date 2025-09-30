// features/home/types.ts
export type Scope = 'me' | 'pair';

export type DaySummary = {
  date: string;         // '2025-09-17'
  score?: number;       // 0-10
  note?: string;
};

export type MonthData = {
  ym: string;           // '2025-09'
  days: DaySummary[];
};

export type EditPayload = {
  date: string;
  score: number;
  note: string;
};
