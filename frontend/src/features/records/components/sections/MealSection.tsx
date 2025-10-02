// frontend/src/features/records/components/sections/MealSection.tsx
import type { RecordView, UpsertPayload } from '../../types';

type MealValue = RecordView['meal'];             // { breakfast: boolean; lunch: boolean; dinner: boolean }
type MealPatch = UpsertPayload['meal'];          // { breakfast?: boolean; lunch?: boolean; dinner?: boolean }

type Props = {
  value: MealValue;
  onChange: (patch: MealPatch) => void;          // 保存パッチを親に渡す
  disabled?: boolean;
};

export default function MealSection({ value, onChange, disabled }: Props) {
  const toggle = (k: keyof MealValue) => {
    if (disabled) return;
    // 変更点だけ送る（パッチ）
    onChange({ [k]: !value[k] });
  };

  const Row = ({ label, keyName }: { label: string; keyName: keyof MealValue }) => {
    const on = Boolean(value[keyName]);
    return (
      <div className="meal-row">
        <span className="meal-badge">{label}</span>
        <button
          type="button"
          className="meal-input"
          onClick={() => toggle(keyName)}
          aria-pressed={on}
          disabled={disabled}
        >
          {on ? '食べた' : '食べてない'}
        </button>
      </div>
    );
  };

  return (
    <>
      <Row label="朝" keyName="breakfast" />
      <Row label="昼" keyName="lunch" />
      <Row label="夜" keyName="dinner" />
    </>
  );
}