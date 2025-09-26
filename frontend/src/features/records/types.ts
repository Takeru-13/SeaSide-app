
export type RecordView = {
  date: string;              // 'YYYY-MM-DD'
  meal: number | null;
  sleep: number | null;
  medicine: number | null;
  period: number | null;
  emotion: number;           // 0-10
};


export type RecordInput = Omit<RecordView, 'date'>;
