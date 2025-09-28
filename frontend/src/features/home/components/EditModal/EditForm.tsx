import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  // 司令塔：状態を握るのはここ。UIは Section に渡してもらうだけ。
  const [meal, setMeal] = useState(initial.meal);
  const [sleep, setSleep] = useState(initial.sleep);
  const [medicine, setMedicine] = useState(initial.medicine);
  const [period, setPeriod] = useState<PeriodRecord>(initial.period ?? 'none');
  const [emotion, setEmotion] = useState<number>(initial.emotion ?? 5);

  const handleGoToDetail = () => {
    navigate(`/records/${initial.date}`);
  };

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return typeof err === 'string' ? err : '保存に失敗しました';
}

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
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
    } catch (err: unknown) {
      setError(getErrorMessage(err));
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

      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          type="button" 
          onClick={handleGoToDetail}
          disabled={saving}
          style={{
            padding: '8px 16px',
            background: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          詳細記録へ
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onCancel} disabled={saving}>
            キャンセル
          </button>
          <button type="submit" disabled={saving}>
            保存
          </button>
        </div>
      </div>
    </form>
  );
}
