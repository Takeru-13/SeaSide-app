// frontend/src/features/home/components/EditModal/types.ts

// ★ 共通のセクション用 Props。disabled を追加
export type SectionProps<T> = {
  value: T;
  onChange: (next: T) => void;
  disabled?: boolean; // ← これを追加
};

// --- 以下は既存の型（必要に応じて調整。例として載せています） ---

export type MealRecord = {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
};

export type SleepRecord = {
  time: string; // "HH:MM"
};

export type MedicineRecord = {
  items: string[];
};

export type PeriodRecord = 'none' | 'start' | 'during';

export type EditFormValue = {
  date: string; // YYYY-MM-DD
  meal: MealRecord;
  sleep: SleepRecord;
  medicine: MedicineRecord;
  period: PeriodRecord;
  emotion: number; // 1-10
};
