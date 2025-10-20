// frontend/src/features/records/components/EditForm.tsx
import { useState } from 'react';

import type { RecordView, UpsertPayload } from '../types';
type RV = RecordView;

import MealSection from './sections/MealSection';
import SleepSection from './sections/SleepSection';
import MedicineSection from './sections/MedicineSection';
import PeriodSection from './sections/PeriodSection';
import EmotionSlider from './sections/EmotionSlider2';
import ExerciseSection from './sections/ExerciseSection';
import MemoSection from './sections/MemoSection';

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
  // 現在値（完全形）をフォーム state で保持
  const [meal, setMeal] = useState<RV['meal']>(initial.meal);
  const [sleep, setSleep] = useState<RV['sleep']>(initial.sleep);
  const [medicine, setMedicine] = useState<RV['medicine']>(initial.medicine);
  const [period, setPeriod] = useState<RV['period']>(initial.period);
  const [emotion, setEmotion] = useState<number>(initial.emotion);

  const [exercise, setExercise] = useState<RV['exercise']>(initial.exercise);
  const [memo, setMemo] = useState<RV['memo']>(initial.memo);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ★ 成功メッセージ（トースト）
  const [success, setSuccess] = useState<string | null>(null);

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

  // ★ 追加: 運動・メモのパッチハンドラ
  const onExercisePatch = (patch: UpsertPayload['exercise']) =>
    setExercise((prev) => ({
      ...prev,
      ...patch,
      items: patch?.items ?? prev.items ?? [],
    }));

  const onMemoPatch = (patch: UpsertPayload['memo']) =>
    setMemo((prev) => ({
      ...prev,
      ...patch,
      content: patch?.content ?? prev.content ?? '',
    }));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // UpsertPayload を組み立て（trim/filter でクリーン化）
      const payload: UpsertPayload = {
        meal,
        sleep,
        medicine: {
          items: (medicine.items ?? []).map((s) => s.trim()).filter(Boolean),
        },
        period,
        emotion,
        // ★ 追加: 運動・メモも送る
        exercise: {
          items: (exercise.items ?? []).map((s) => s.trim()).filter(Boolean),
        },
        memo: {
          content: (memo.content ?? '').trim(),
        },
      };

      await onSave(payload);

      // ★ 成功トースト（3秒で消える）
      setSuccess('登録しました！');
      setTimeout(() => setSuccess(null), 3000);
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

          <section className={`${styles.panel} ${styles.panelSleep}`}>
            <h4 className={styles.panelTitle}>睡眠</h4>
            <SleepSection value={sleep} onChange={onSleepPatch} disabled={saving} />
          </section>

          <section className={styles.panel}>
            <h4 className={styles.panelTitle}>服薬</h4>
            <MedicineSection
              value={medicine}
              onChange={onMedicinePatch}
              disabled={saving}
              showTitle={false}  // 外側でタイトルを表示するので、内部タイトル（常用薬トグル含む）は非表示
            />
          </section>

          <section className={`${styles.panel} ${styles.panelPeriod}`}>
            <h4 className={styles.panelTitle}>月経</h4>
            <div className={styles.panelBox}>
              <PeriodSection
                value={period}
                onChange={onPeriodPatch}
                disabled={saving}
              />
            </div>
          </section>
        </div>

        <section className={styles.panel}>
          <h4 className={styles.panelTitle}>感情</h4>
          <EmotionSlider
            value={emotion}
            onChange={(n) => setEmotion(n ?? 5)}
            disabled={saving}
            className="h-slider"
          />
        </section>
      </div>

      {/* ★ 追加: 運動・メモ（縦並びセクション） */}
      <section className={styles.panel}>
        <h4 className={styles.panelTitle}>運動</h4>
        <ExerciseSection value={exercise} onChange={onExercisePatch} disabled={saving} />
      </section>

      <section className={styles.panel}>
        <h4 className={styles.panelTitle}>メモ</h4>
        <MemoSection value={memo} onChange={onMemoPatch} disabled={saving} />
      </section>

      {/* エラー表示 */}
      {error && <div className={styles.alertError}>{error}</div>}

      {/* ★ 成功トースト */}
      {success && (
        <div className={styles.alertSuccess} role="status" aria-live="polite">
          {success}
        </div>
      )}

      <div className={styles.ctaRow}>
        <button type="submit" disabled={saving} className={styles.cta}>
          {saving ? '登録中…' : '登録！'}
        </button>

        <div className={styles.rowActions}>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="閉じる"
            className={styles.chipClose}
          >
            ×
          </button>
        </div>
      </div>
    </form>
  );
}
