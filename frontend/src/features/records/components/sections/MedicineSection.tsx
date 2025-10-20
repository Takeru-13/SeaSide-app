// 服薬タイトルの右横に“今日飲んだ”トグルを並べる版（薬タグUIは温存）
import { useState } from 'react';
import type { RecordView, UpsertPayload } from '../../types';
import './MedicineSection.css';
type Props = {
  value: RecordView['medicine'];
  onChange: (patch: UpsertPayload['medicine']) => void;
  disabled?: boolean;

  // 今日飲んだか（boolean）だけを扱う
  tookDailyMed?: boolean;
  onToggleDailyMed?: (next: boolean) => void;

  /** 見出し（服薬）をこのコンポーネント内で出すか */
  showTitle?: boolean;

  /** 薬のリスト編集UIを表示するか（クイック記録では非表示） */
  showMedicineList?: boolean;
};

export default function MedicineSection({
  value,
  onChange,
  disabled,
  tookDailyMed,
  onToggleDailyMed,
  showTitle = true,
  showMedicineList = true,
}: Props) {
  const items = value.items ?? [];
  const [newMed, setNewMed] = useState('');

  const addMedicine = () => {
    const t = newMed.trim();
    if (t) {
      onChange({ items: [...items, t] });
      setNewMed('');
    }
  };

  const removeMedicine = (idx: number) => {
    onChange({ items: items.filter((_, i) => i !== idx) });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMedicine();
    }
  };

  const handleToggleDaily = () => {
    if (disabled || !onToggleDailyMed || typeof tookDailyMed === 'undefined') return;
    onToggleDailyMed(!tookDailyMed);
  };

  return (
    <div className="medicine-content">
      {/* 見出し＋右側トグル（タイトルはここで出す） */}
{showTitle && (
  <div className="medicine-header">
    <h4 className="medicine-title">💊服薬💊</h4>

    {/* 右側グループ：常用薬: [ボタン] をひとかたまりに */}
    <div className="medicine-right" role="group" aria-label="常用薬の服薬状況">
      <span className="field-label">常用薬:</span>
      {typeof tookDailyMed !== 'undefined' && onToggleDailyMed && (
<button
  type="button"
  className={`pill-btn pill-btn--primary ${tookDailyMed ? 'is-active' : ''}`}
  aria-pressed={tookDailyMed}
  onClick={handleToggleDaily}
  disabled={disabled}
  title="今日の服薬"
>
  {tookDailyMed ? '飲んだ' : '飲んでない'}
</button>
      )}
    </div>
  </div>
)}

      {/* 薬タグの一覧（クイック記録では非表示） */}
      {showMedicineList && (
        <>
          <div className="medicine-tags">
            {items.map((med, i) => (
              <span key={i} className="medicine-tag">
                {med}
                <button
                  type="button"
                  onClick={() => removeMedicine(i)}
                  disabled={disabled}
                  className="medicine-tag-remove"
                  aria-label="削除"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* 薬名の追加入力 */}
          <div className="medicine-input">
            <input
              type="text"
              value={newMed}
              onChange={(e) => setNewMed(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="薬名を入力"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={addMedicine}
              disabled={disabled}
              className="medicine-add-btn"
              aria-label="追加"
            >
            +
            </button>
          </div>
        </>
      )}
    </div>
  );
}
