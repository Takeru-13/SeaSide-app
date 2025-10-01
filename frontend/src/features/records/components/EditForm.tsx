// frontend/src/features/records/components/EditForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { RecordView, UpsertPayload } from '../types';
type RV = RecordView;

import MealSection from './sections/MealSection';
import SleepSection from './sections/SleepSection';
import MedicineSection from './sections/MedicineSection';
import PeriodSection from './sections/PeriodSection';
import EmotionSlider from './sections/EmotionSlider';

import styles from './EditForm.module.css';

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return typeof err === 'string' ? err : '保存に失敗しました';
}

type Props = {
  /** モーダル初期表示用（toView と同形） */
  initial: RecordView;
  onCancel: () => void;
  /** 差分パッチを送る（PUT /records/:date の UpsertPayload） */
  onSave: (patch: UpsertPayload) => Promise<void>;
};

export default function EditForm({ initial, onCancel, onSave }: Props) {
  const navigate = useNavigate();

  // 現在値（完全形）をフォーム state で保持
  const [meal, setMeal] = useState<RV['meal']>(initial.meal);
  const [sleep, setSleep] = useState<RV['sleep']>(initial.sleep);
  const [medicine, setMedicine] = useState<RV['medicine']>(initial.medicine);
  const [period, setPeriod] = useState<RV['period']>(initial.period);
  const [emotion, setEmotion] = useState<number>(initial.emotion);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoToDetail = () => navigate(`/records/${initial.date}`);

  // 子セクションは「パッチ」を返す契約なので、ここで現在値にマージ
  const onMealPatch = (patch: UpsertPayload['meal']) =>
    setMeal((prev) => ({ ...prev, ...patch }));

  const onSleepPatch = (patch: UpsertPayload['sleep']) =>
    setSleep((prev) => ({ ...prev, ...patch }));

  const onMedicinePatch = (patch: UpsertPayload['medicine']) =>
    setMedicine((prev) => {
      if (!patch || !('items' in patch)) return prev;
      return { ...prev, items: patch.items ?? [] };
    });

  const onPeriodPatch = (v: UpsertPayload['period']) => {
    if (!v) return;
    setPeriod(v);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // UpsertPayload を組み立て（trim/filter でクリーン化）
      const payload: UpsertPayload = {
        meal,
        sleep,
        medicine: { items: (medicine.items ?? []).map((s) => s.trim()).filter(Boolean) },
        period,
        emotion,
      };
      await onSave(payload);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className={styles.editSheet}>
      <div className={styles.sheetCard}>
        <div className={styles.matrix}>
          <section className={`${styles.panel} ${styles.panelMeal}`}>
            <h4 className={styles.panelTitle}>食事</h4>
            <div className={styles.panelBox}>
              <MealSection value={meal} onChange={onMealPatch} disabled={saving} />
            </div>
          </section>

          <section className={styles.panel}>
            <h4 className={styles.panelTitle}>睡眠</h4>
            <SleepSection value={sleep} onChange={onSleepPatch} disabled={saving} />
          </section>

          <section className={styles.panel}>
            <h4 className={styles.panelTitle}>服薬</h4>
            <MedicineSection value={medicine} onChange={onMedicinePatch} disabled={saving} />
          </section>

          <section className={`${styles.panel} ${styles.panelPeriod}`}>
            <h4 className={styles.panelTitle}>生理</h4>
            <div className={styles.panelBox}>
              <PeriodSection value={period} onChange={onPeriodPatch} disabled={saving} />
            </div>
          </section>
        </div>

        <div className={styles.rail}>
          <EmotionSlider
            value={emotion}
            onChange={(n) => setEmotion(n ?? 5)}  // 念のためフォールバック
            disabled={saving}
            className="v-slider"
          />
        </div>
      </div>

      {error && <div className={styles.alertError}>{error}</div>}

      <div className={styles.ctaRow}>
        <button type="submit" disabled={saving} className={styles.cta}>
          {saving ? '登録中…' : '登録！'}
        </button>

        <div className={styles.rowActions}>
          <button type="button" onClick={handleGoToDetail} disabled={saving} className={styles.chipPrimary}>
            詳しく入力・見る
          </button>
          <button type="button" onClick={onCancel} disabled={saving} aria-label="閉じる" className={styles.chipClose}>
            ×
          </button>
        </div>
      </div>
    </form>
  );
}
