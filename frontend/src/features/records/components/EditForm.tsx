import { useState } from 'react';
import type { EditFormValue, PeriodRecord } from '../../types';

import MealSection from './editFormSections/MealSection';
import SleepSection from './editFormSections/SleepSection';
import MedicineSection from './editFormSections/MedicineSection';
import PeriodSection from './editFormSections/PeriodSection';
import EmotionSlider from './editFormSections/EmotionSlider';
import ExerciseSection from './editFormSections/ExerciseSection';
import MemoSection from './editFormSections/MemoSection';

import './recordDetail.css';

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return '保存に失敗しました';
}

export default function EditForm({
  initial, onCancel, onSave, readOnly = false,
}: {
  initial: EditFormValue;
  onCancel: () => void;
  onSave: (v: EditFormValue) => Promise<void>;
  readOnly?: boolean;
}) {
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
    if (readOnly) { setError('ペアの記録は閲覧のみです'); return; }
    setSaving(true); setError(null);
    try {
      const normalized: EditFormValue = {
        ...initial,
        meal,
        sleep,
        medicine: { items: (medicine.items ?? []).map((s: string) => s.trim()).filter(Boolean) },
        period,
        emotion,
        exercise: { items: (exercise.items ?? []).map((s: string) => s.trim()).filter(Boolean) },
        memo,
      };
      await onSave(normalized);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="detail-form">
      <header className="detail-header">
        <div className="detail-pill">○○の詳細記録</div>
      </header>

      <div className="detail-grid detail-grid--hero">
        {/* 左：2×2 */}
        <section className="detail-card panel panel--meal">
          <h4 className="panel__title">食事</h4>
          <div className="panel-box">
            <MealSection value={meal} onChange={setMeal} disabled={saving || readOnly} />
          </div>
        </section>

        {/* 右：スライダー */}
        <section className="detail-card detail-card--slider">
          <div className="rail">
            <EmotionSlider value={emotion} onChange={setEmotion} disabled={saving || readOnly}  />
          </div>
        </section>

        <section className="detail-card">
          <h4 className="panel__title">睡眠</h4>
          <SleepSection value={sleep} onChange={setSleep} disabled={saving || readOnly} />
        </section>

        <section className="detail-card">
          <h4 className="panel__title">服薬</h4>
          <MedicineSection value={medicine} onChange={setMedicine} disabled={saving || readOnly} />
        </section>

        <section className="detail-card panel panel--period">
          <h4 className="panel__title">生理</h4>
          <div className="panel-box">
            <PeriodSection value={period} onChange={setPeriod} disabled={saving || readOnly} />
          </div>
        </section>

        {/* 下段：運動・メモ（2列ぶち抜き） */}
        <section className="detail-card detail-card--span2">
          <h4 className="panel__title">運動</h4>
          <ExerciseSection value={exercise} onChange={setExercise} disabled={saving || readOnly} />
        </section>

        <section className="detail-card detail-card--span2">
          <h4 className="panel__title">メモ</h4>
          <MemoSection value={memo} onChange={setMemo} disabled={saving || readOnly} />
        </section>
      </div>

      {error && <div className="banner banner--error">{error}</div>}

      <div className="detail-actions">
        <button type="button" onClick={onCancel} disabled={saving} className="btn btn--ghost">戻る</button>
        <button type="submit" disabled={saving || readOnly} className="cta">
          {saving ? '保存中…' : '登録！'}
        </button>
      </div>
    </form>
  );
}
