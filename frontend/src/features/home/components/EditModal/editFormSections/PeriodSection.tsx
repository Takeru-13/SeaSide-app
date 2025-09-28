import type { PeriodRecord, SectionProps } from '../types';

export default function PeriodSection({ value, onChange }: SectionProps<PeriodRecord>) {
  return (
    <section>
      <h4>月経</h4>
      <label>
        <input
          type="radio"
          checked={value === 'none'}
          onChange={() => onChange('none')}
        />
        無し
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'start'}
          onChange={() => onChange('start')}
        />
        開始
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'during'}
          onChange={() => onChange('during')}
        />
        月経中
      </label>
    </section>
  );
}