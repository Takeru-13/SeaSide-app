import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EditFormValue, PeriodRecord } from './types';

import MealSection from './editFormSections/MealSection';
import SleepSection from './editFormSections/SleepSection';
import MedicineSection from './editFormSections/MedicineSection';
import PeriodSection from './editFormSections/PeriodSection';
import EmotionSlider from './editFormSections/EmotionSlider';

import './EditForm.css';

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return typeof err === 'string' ? err : '保存に失敗しました';
}

export default function EditForm({
  initial, onCancel, onSave,
}: {
  initial: EditFormValue;
  onCancel: () => void;
  onSave: (v: EditFormValue) => Promise<void>;
}) {
  const navigate = useNavigate();
  const [meal, setMeal] = useState(initial.meal);
  const [sleep, setSleep] = useState(initial.sleep);
  const [medicine, setMedicine] = useState(initial.medicine);
  const [period, setPeriod] = useState<PeriodRecord>(initial.period ?? 'none');
  const [emotion, setEmotion] = useState<number>(initial.emotion ?? 5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoToDetail = () => navigate(`/records/${initial.date}`);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const normalized: EditFormValue = {
        ...initial,
        meal,
        sleep,
        medicine: { items: (medicine.items ?? []).map((s) => s.trim()).filter(Boolean) },
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
    <form onSubmit={submit} className="edit-sheet">
      <div className="sheet-card">
        <div className="matrix">
          <section className="panel panel--meal">
            <h4 className="panel__title">食事</h4>
            <div className="panel-box">
              <MealSection value={meal} onChange={setMeal} disabled={saving} />
            </div>
          </section>

          <section className="panel">
            <h4 className="panel__title">睡眠</h4>
            <SleepSection value={sleep} onChange={setSleep} disabled={saving} />
          </section>

          <section className="panel">
            <h4 className="panel__title">服薬</h4>
            <MedicineSection value={medicine} onChange={setMedicine} disabled={saving} />
          </section>

          <section className="panel panel--period">
            <h4 className="panel__title">生理</h4>
            <div className="panel-box">
              <PeriodSection value={period} onChange={setPeriod} disabled={saving} />
            </div>
          </section>
        </div>

        <div className="rail">
          <EmotionSlider value={emotion} onChange={setEmotion} disabled={saving} className="v-slider" />
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="cta-row">
        <button type="submit" disabled={saving} className="cta">
          {saving ? '登録中…' : '登録！'}
        </button>

        <div className="row-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 16 }}>
          <button type="button" onClick={handleGoToDetail} disabled={saving}
            className="chip chip--primary">詳しく入力・見る</button>
          <button type="button" onClick={onCancel} disabled={saving} aria-label="閉じる"
            className="chip chip--close">×</button>
        </div>
      </div>
    </form>
  );
}
