import type { SectionProps } from '../types';
type PeriodRecord = 'none' | 'start' | 'during';

export default function PeriodSection({ value, onChange, disabled }: SectionProps<PeriodRecord>) {
  const Item = ({ v, label }: { v: PeriodRecord; label: string }) => (
    <label className={`period-btn ${value === v ? 'is-selected' : ''}`}>
      <input type="radio" name="period" value={v}
        checked={value === v} onChange={() => onChange(v)} disabled={disabled} />
      {label}
    </label>
  );
  return (
    <>
      <Item v="none"   label="無し" />
      <Item v="start"  label="開始" />
      <Item v="during" label="生理中" />
    </>
  );
}
