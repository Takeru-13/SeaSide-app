import { useState } from 'react';
import type { EditFormValue, PeriodRecord } from './types';

export default function EditForm({
  initial, onCancel, onSave,
}: {
  initial: EditFormValue;
  onCancel: () => void;
  onSave: (v: EditFormValue) => Promise<void>;
}) {
  const [meal, setMeal] = useState(initial.meal);
  const [sleep, setSleep] = useState(initial.sleep);
  const [medicine, setMedicine] = useState(initial.medicine);
  const [period, setPeriod] = useState<PeriodRecord>(initial.period ?? 'none');
  const [emotion, setEmotion] = useState<number>(initial.emotion ?? 5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await onSave({ ...initial, meal, sleep, medicine, period, emotion });
    } catch (err: any) {
      setError(err?.message ?? '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, minWidth: 320 }}>
      <h3>{initial.date} の記録</h3>

      <fieldset>
        <legend>Meal</legend>
        <label>
          <input
            type="checkbox"
            checked={meal.breakfast}
            onChange={(e) => setMeal({ ...meal, breakfast: e.target.checked })}
          /> 朝
        </label>{' '}
        <label>
          <input
            type="checkbox"
            checked={meal.lunch}
            onChange={(e) => setMeal({ ...meal, lunch: e.target.checked })}
          /> 昼
        </label>{' '}
        <label>
          <input
            type="checkbox"
            checked={meal.dinner}
            onChange={(e) => setMeal({ ...meal, dinner: e.target.checked })}
          /> 夜
        </label>
      </fieldset>

      <label>
        Sleep time
        <input
          type="time"
          value={sleep.time}
          onChange={(e) => setSleep({ time: e.target.value })}
        />
      </label>

      <label>
        Medicine（カンマ区切り）
        <input
          type="text"
          value={medicine.items.join(',')}
          onChange={(e) =>
            setMedicine({
              items: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="iron, vitaminC"
        />
      </label>

      <label>
        Period
        <select value={period} onChange={(e) => setPeriod(e.target.value as PeriodRecord)}>
          <option value="none">なし</option>
          <option value="start">開始</option>
          <option value="during">期間中</option>
        </select>
      </label>

      <label>
        Emotion（1–10）
        <input
          type="range"
          min={1}
          max={10}
          value={emotion}
          onChange={(e) => setEmotion(Number(e.target.value))}
        />
        <div>現在: {emotion}</div>
      </label>

      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} disabled={saving}>キャンセル</button>
        <button type="submit" disabled={saving}>保存</button>
      </div>
    </form>
  );
}
