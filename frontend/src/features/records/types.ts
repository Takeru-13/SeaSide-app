export type Scope = 'me' | 'pair';
export type DateKey = `${number}-${number}-${number}`; // 'YYYY-MM-DD' 想定

/** 生理の状態は BE DTO と一致させる */
export type Period = 'none' | 'start' | 'during';

/** 詳細表示／編集フォームと同形（BE → FE の標準形） */
export type RecordView = {
  date: DateKey;
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };
  sleep: { time: string };
  medicine: { items: string[] };
  period: Period;
  /** 1..10 を想定（BE側で clamp） */
  emotion: number;

  exercise: { items: string[] };
  memo: { content: string };
};

/**
 * 保存時ペイロード（FE → BE）
 * - BE は欠損を許容してデフォルト埋め/クランプする実装なので optional 設計にする
 * - クイック保存では exercise/memo を送らない想定でも OK
 */
export type UpsertPayload = {
  meal?: Partial<{ breakfast: boolean; lunch: boolean; dinner: boolean }>;
  sleep?: { time?: string };
  medicine?: { items?: string[] };
  period?: Period;
  /** 1..10 を想定（未指定時は BE でデフォ） */
  emotion?: number;

  exercise?: { items?: string[] };
  memo?: { content?: string };
};

/** カレンダー月次（emotion のみ） */
export type MonthlyDay = {
  date: DateKey;
  emotion: number | null;
};
export type MonthlyResponse = {
  ym: `${number}-${number}`; // 'YYYY-MM'
  days: MonthlyDay[];
};
