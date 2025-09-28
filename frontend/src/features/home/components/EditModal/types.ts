// frontend/src/features/home/components/EditModal/types.ts
export type SectionProps<T> = {
  value: T;
  onChange: (next: T) => void;
  disabled?: boolean; 
};

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

export type ExerciseRecord = {
  items: string[];
};

export type MemoRecord = {
  content: string;
};

export type EditFormValue = {
  date: string; // YYYY-MM-DD
  meal: MealRecord;
  sleep: SleepRecord;
  medicine: MedicineRecord;
  period: PeriodRecord;
  emotion: number; // 1-10

  exercise: ExerciseRecord;
  memo: MemoRecord;
};
