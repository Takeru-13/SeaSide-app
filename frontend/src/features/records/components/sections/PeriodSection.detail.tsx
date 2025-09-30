import type { PeriodRecord, SectionProps } from '../../types';

export default function PeriodSection({ value, onChange, disabled }: SectionProps<PeriodRecord>) {
  return (
    <section>
      <h4>月経</h4>
      <label>
        <input
          type="radio"
          checked={value === 'none'}
          onChange={() => !disabled && onChange('none')}
          disabled={disabled}
        />
        無し
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'start'}
          onChange={() => !disabled && onChange('start')}
          disabled={disabled}
        />
        月経中
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'during'}
          onChange={() => !disabled && onChange('during')}
          disabled={disabled}
        />
        開始
      </label>
    </section>
  );
}

