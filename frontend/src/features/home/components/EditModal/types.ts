// EditFormValue（全入力値のオブジェクト）を定義して、onSave で返す
export type MealRecord = {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
};

export type SleepRecord = {
  time: string;
};

export type MedicineRecord = {
  items: string[]; //何種類か飲む可能性を考慮して配列に変更
};

export type PeriodRecord = 'none' | 'start' | 'during';

export type EmotionRecord = number;

export type EditFormValue = {
  date: string;  //もしかしたら要らないかも。将来削除予定
  meal: MealRecord;
  sleep: SleepRecord;
  medicine: MedicineRecord;
  period: PeriodRecord;
  emotion: EmotionRecord;
};

export type SectionProps<T> = {
  value: T;
  onChange: (v: T) => void;
}