// frontend/src/features/records/components/sections/PeriodSection.tsx
import type { RecordView, UpsertPayload } from '../../types';

type Props = {
  value: RecordView['period'];                // 'none' | 'start' | 'during'
  onChange: (v: UpsertPayload['period']) => void; // 保存パッチは同じ union 型
  disabled?: boolean;
};

export default function PeriodSection({ value, onChange, disabled }: Props) {
  const Item = ({ v, label }: { v: RecordView['period']; label: string }) => (
    <label className={`period-btn ${value === v ? 'is-selected' : ''}`}>
      <input
        type="radio"
        name="period"
        value={v}
        checked={value === v}
        onChange={() => onChange(v)}
        disabled={disabled}
      />
      {label}
    </label>
  );

  return (
    <>
      <Item v="none" label="無し" />
      <Item v="start" label="開始" />
      <Item v="during" label="生理中" />
    </>
  );
}
