import type { MealRecord, SectionProps } from '../types';

export default function MealSection({ value, onChange }: SectionProps<MealRecord>) {
  return (
    <section>
      <h4>食事</h4>
      <label>
        <input
          type="checkbox"
          checked={value.breakfast}
          onChange={(e) => onChange({ ...value, breakfast: e.target.checked })}
        />
        朝
      </label>
      <label>
        <input
          type="checkbox"
          checked={value.lunch}
          onChange={(e) => onChange({ ...value, lunch: e.target.checked })}
        />
        昼
      </label>
      <label>
        <input
          type="checkbox"
          checked={value.dinner}
          onChange={(e) => onChange({ ...value, dinner: e.target.checked })}
        />
        夜
      </label>
    </section>
  );
}