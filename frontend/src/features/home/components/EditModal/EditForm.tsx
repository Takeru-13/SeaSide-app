import { useState } from 'react';
import type { EditFormValue, PeriodRecord } from './types';

// 各フォームセクション（見た目＆入力）は分割したコンポーネントに委譲
import MealSection from './editFormSections/MealSection';
import SleepSection from './editFormSections/SleepSection';
import MedicineSection from './editFormSections/MedicineSection';
import PeriodSection from './editFormSections/PeriodSection';
import EmotionSlider from './editFormSections/EmotionSlider';

export default function EditForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: EditFormValue;
  onCancel: () => void;
  onSave: (v: EditFormValue) => Promise<void>;
}) {
  // 司令塔：状態を握るのはここ。UIは Section に渡してもらうだけ。
  const [meal, setMeal] = useState(initial.meal);
  const [sleep, setSleep] = useState(initial.sleep);
  const [medicine, setMedicine] = useState(initial.medicine);
  const [period, setPeriod] = useState<PeriodRecord>(initial.period ?? 'none');
  const [emotion, setEmotion] = useState<number>(initial.emotion ?? 5);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // 送信前に軽く正規化（空要素除去など）
      const normalized: EditFormValue = {
        ...initial,
        meal,
        sleep,
        medicine: {
          items: (medicine.items ?? []).map((s) => s.trim()).filter(Boolean),
        },
        period,
        emotion,
      };
      await onSave(normalized);
    } catch (err: any) {
      setError(err?.message ?? '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 14, minWidth: 320 }}>
      <h3>{initial.date} の記録</h3>

      {/* 食事 */}
      <MealSection value={meal} onChange={setMeal} disabled={saving} />

      {/* 睡眠 */}
      <SleepSection value={sleep} onChange={setSleep} disabled={saving} />

      {/* 薬：複数行入力に変更済み（カンマ区切りは廃止） */}
      <MedicineSection value={medicine} onChange={setMedicine} disabled={saving} />

      {/* 生理 */}
      <PeriodSection value={period} onChange={setPeriod} disabled={saving} />

      {/* 感情 */}
      <EmotionSlider value={emotion} onChange={setEmotion} disabled={saving} />

      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} disabled={saving}>
          キャンセル
        </button>
        <button type="submit" disabled={saving}>
          保存
        </button>
      </div>
    </form>
  );
}
