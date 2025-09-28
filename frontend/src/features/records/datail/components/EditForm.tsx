// src/features/records/detail/components/EditForm.tsx
import { useState } from 'react';
import type { EditFormValue, PeriodRecord } from '../types';

import MealSection from './editFormSections/MealSection';
import SleepSection from './editFormSections/SleepSection';
import MedicineSection from './editFormSections/MedicineSection';
import PeriodSection from './editFormSections/PeriodSection';
import EmotionSlider from './editFormSections/EmotionSlider';
import ExerciseSection from './editFormSections/ExerciseSection';
import MemoSection from './editFormSections/MemoSection';

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return '保存に失敗しました';
}

export default function EditForm({
  initial,
  onCancel,
  onSave,
  readOnly = false,
}: {
  initial: EditFormValue;
  onCancel: () => void;
  onSave: (v: EditFormValue) => Promise<void>;
  readOnly?: boolean;
}) {
  // 司令塔：状態はここで握る
  const [meal, setMeal] = useState(initial.meal);
  const [sleep, setSleep] = useState(initial.sleep);
  const [medicine, setMedicine] = useState(initial.medicine);
  const [period, setPeriod] = useState<PeriodRecord>(initial.period ?? 'none');
  const [emotion, setEmotion] = useState<number>(initial.emotion ?? 5);
  const [exercise, setExercise] = useState(initial.exercise ?? { items: [] });
  const [memo, setMemo] = useState(initial.memo ?? { content: '' });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (readOnly) {
      setError("ペアの記録は閲覧のみです");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const normalized: EditFormValue = {
        ...initial,
        meal,
        sleep,
        medicine: {
          items: (medicine.items ?? []).map((s: string) => s.trim()).filter(Boolean),
        },
        period,
        emotion,
        exercise: {
          items: (exercise.items ?? []).map((s: string) => s.trim()).filter(Boolean),
        },
        memo,
      };
      await onSave(normalized);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 14, minWidth: 320 }}>
      <h3>{initial.date} の記録</h3>

      <MealSection value={meal} onChange={setMeal} disabled={saving || readOnly} />
      <SleepSection value={sleep} onChange={setSleep} disabled={saving || readOnly} />
      <MedicineSection value={medicine} onChange={setMedicine} disabled={saving || readOnly} />
      <PeriodSection value={period} onChange={setPeriod} disabled={saving || readOnly} />
      <EmotionSlider value={emotion} onChange={setEmotion} disabled={saving || readOnly} />
      <ExerciseSection value={exercise} onChange={setExercise} disabled={saving || readOnly} />
      <MemoSection value={memo} onChange={setMemo} disabled={saving || readOnly} />

      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} disabled={saving}>キャンセル</button>
        <button type="submit" disabled={saving || readOnly}>保存</button>
      </div>
    </form>
  );
}
