// === 1日記録（Record）で使う型はここに集約 ===

// DB/APIと一致する“詳細”型
export type MealRecord = { breakfast: boolean; lunch: boolean; dinner: boolean };
export type SleepRecord = { time: string };
export type MedicineRecord = { items: string[] };
export type PeriodRecord = 'none' | 'start' | 'during';

// フォームで保持する値（date は path param 用。body には含めない）
export type EditFormValue = {
  date: string;
  meal: MealRecord;
  sleep: SleepRecord;
  medicine: MedicineRecord;
  period: PeriodRecord;   // セレクトで必ずこのいずれか
  emotion: number;        // 1..10 の整数（バーで選択）
};

// PUT /records/:date の body
export type UpdateRecordPayload = {
  meal: MealRecord;
  sleep: SleepRecord;
  medicine: MedicineRecord;
  period: PeriodRecord;
  emotion: number;        // 1..10
};

// サーバから返る“その日の完全データ”
export type DayRecordResponse = {
  date: string;
  meal: MealRecord;
  sleep: SleepRecord;
  medicine: MedicineRecord;
  period: PeriodRecord;
  emotion: number;
};

// UIセクション用（必要なら使ってOK）
export type SectionProps<T> = { value: T; onChange: (v: T) => void };
