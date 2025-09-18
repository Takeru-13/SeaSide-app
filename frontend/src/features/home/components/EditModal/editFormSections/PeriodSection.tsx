import type { PeriodRecord, SectionProps } from '../types';

export default function PeriodSection({ value, onChange }: SectionProps<PeriodRecord>) {
  return (
    <section>
      <h4>生理</h4>
      <label>
        <input
          type="radio"
          checked={value === 'none'}
          onChange={() => onChange('none')}
        />
        生理じゃない
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'start'}
          onChange={() => onChange('start')}
        />
        生理開始
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'during'}
          onChange={() => onChange('during')}
        />
        生理中
      </label>
    </section>
  );
}