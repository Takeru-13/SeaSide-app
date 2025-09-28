import type { MealRecord, SectionProps } from '../../types';

export default function MealSection({ value, onChange, disabled }: SectionProps<MealRecord>) {
  return (
    <section>
      <h4>食事</h4>
      <label>
        <input
          type="checkbox"
          checked={value.breakfast}
          onChange={(e) => !disabled && onChange({ ...value, breakfast: e.target.checked })}
          disabled={disabled}
        />
        朝
      </label>
      <label>
        <input
          type="checkbox"
          checked={value.lunch}
          onChange={(e) => !disabled && onChange({ ...value, lunch: e.target.checked })}
          disabled={disabled}
        />
        昼
      </label>
      <label>
        <input
          type="checkbox"
          checked={value.dinner}
          onChange={(e) => !disabled && onChange({ ...value, dinner: e.target.checked })}
          disabled={disabled}
        />
        夜
      </label>
    </section>
  );
}

