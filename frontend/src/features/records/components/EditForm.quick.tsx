// frontend/src/features/home/components/EditForm.quick.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ 型は records/types からのみ（相対パスで3つ戻る）
import type { RecordView, UpsertPayload } from '../types';
type RV = RecordView;

import MealSection from './sections/MealSection';
import SleepSection from './sections/SleepSection';
import MedicineSection from './sections/MedicineSection';
import PeriodSection from './sections/PeriodSection';
import EmotionSlider from './sections/EmotionSlider';

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

export default function EditFormQuick({ initial, onCancel, onSave }: Props) {
  const navigate = useNavigate();

  // ✅ 現在値（完全形）をフォーム state で保持
  const [meal, setMeal] = useState<RV['meal']>(initial.meal);
  const [sleep, setSleep] = useState<RV['sleep']>(initial.sleep);
  const [medicine, setMedicine] = useState<RV['medicine']>(initial.medicine);
  const [period, setPeriod] = useState<RV['period']>(initial.period);
  const [emotion, setEmotion] = useState<number>(initial.emotion);
  // ✅ 追加：常備薬チェック（初期値は既存値を真偽化）
  const [tookDailyMed, setTookDailyMed] = useState<boolean>(!!initial.tookDailyMed);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoToDetail = () => navigate(`/records/${initial.date}`);

  // ✅ セクションは「パッチ」を返す契約なので、ここで現在値にマージ
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
      // ✅ UpsertPayload を組み立て（undefined はAPI側で無視されるのでそのままでOK）
      const payload: UpsertPayload = {
        meal,
        sleep,
        medicine: { items: (medicine.items ?? []).map((s) => s.trim()).filter(Boolean) },
        period,
        emotion,
        tookDailyMed, 
      };
      await onSave(payload);
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
            <h4 className="panel__title">🍚食事🍚</h4>
            <div className="panel-box">
              {/* 子はパッチを返すので、ここでマージ */}
              <MealSection value={meal} onChange={onMealPatch} disabled={saving} />
            </div>
          </section>

          <section className="panel">
            <h4 className="panel__title">😪睡眠😪</h4>
            <SleepSection value={sleep} onChange={onSleepPatch} disabled={saving} />
          </section>

          <section className="panel">
            <h4 className="panel__title">💊服薬💊</h4>
            <MedicineSection
              value={medicine}
              onChange={onMedicinePatch}
              disabled={saving}
              /* ↓ 追加：常備薬チェックをセクションに渡す */
              tookDailyMed={tookDailyMed}
              onToggleDailyMed={setTookDailyMed}
            />
          </section>

          <section className="panel panel--period">
            <h4 className="panel__title">🩸月経🩸</h4>
            <div className="panel-box">
              <PeriodSection value={period} onChange={onPeriodPatch} disabled={saving} />
            </div>
          </section>
        </div>

        <div className="rail">
          <div className="v-slider panel">
            {/* ← 追加：縦書きをスライダー本体だけに適用 */}
            <div className="slider-rail">
              <EmotionSlider
                value={emotion}
                onChange={(n) => setEmotion(n ?? 5)}
                disabled={saving}
              />
            </div>
            <div className="emotion-value" aria-live="polite">
              {emotion}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="cta-row">
        <button type="submit" disabled={saving} className="cta">
          {saving ? '登録中…' : '登録！'}
        </button>

        <div className="row-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 16 }}>
          <button
            type="button"
            onClick={handleGoToDetail}
            disabled={saving}
            className="chip chip--primary"
          >
            詳しく入力・見る
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="閉じる"
            className="chip chip--close"
          >
            ×
          </button>
        </div>
      </div>
    </form>
  );
}
