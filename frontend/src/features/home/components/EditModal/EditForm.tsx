import { useState } from 'react';
import MealSection from './editFormSections/MealSection';
import SleepSection from './editFormSections/SleepSection';
import MedicineSection from './editFormSections/MedicineSection';
import PeriodSection from './editFormSections/PeriodSection';
import EmotionSlider from './editFormSections/EmotionSlider';
import type { EditFormValue, MealRecord, SleepRecord, MedicineRecord, PeriodRecord, EmotionRecord } from './types';


type Props = {
  date: string;
  initial?: Partial<EditFormValue>;
  onSubmit: (v: EditFormValue) => void;
};

export default function EditForm({ date, initial, onSubmit }: Props) {
  // 初期値（空でも動くように最低限を定義）
  const [meal, setMeal] = useState<MealRecord>(initial?.meal ?? { breakfast: false, lunch: false, dinner: false });
  const [sleep, setSleep] = useState<SleepRecord>(initial?.sleep ?? { time: '' });
  const [medicine, setMedicine] = useState<MedicineRecord>(initial?.medicine ?? { items: [] });
  const [period, setPeriod] = useState<PeriodRecord>(initial?.period ?? 'none');
  const [emotion, setEmotion] = useState<EmotionRecord>(initial?.emotion ?? 5);

  const submit = () => {
    onSubmit({
      date,
      meal,
      sleep,
      medicine,
      period,
      emotion,
    });
  };

  return (
    <div>
      {/* 上段：食事 / 睡眠 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MealSection value={meal} onChange={setMeal} />
        <SleepSection value={sleep} onChange={setSleep} />
      </div>

      {/* 中段：服薬 / 生理 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <MedicineSection value={medicine} onChange={setMedicine} />
        <PeriodSection value={period} onChange={setPeriod} />
      </div>

      {/* 右側：感情スライダー（暫定的に下に配置） */}
      <div style={{ marginTop: 12 }}>
        <EmotionSlider value={emotion} onChange={setEmotion} />
      </div>

      {/* ボタン */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
        <button type="button" onClick={submit}>登録！</button>
      </div>
    </div>
  );
}