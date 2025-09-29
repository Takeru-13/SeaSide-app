import type { SectionProps } from '../types';
type MealRecord = { breakfast?: boolean; lunch?: boolean; dinner?: boolean };

export default function MealSection({ value, onChange, disabled }: SectionProps<MealRecord>) {
  const toggle = (k: keyof MealRecord) => !disabled && onChange({ ...value, [k]: !value[k] });
  const Row = ({ label, keyName }: { label: string; keyName: keyof MealRecord }) => {
    const on = Boolean(value[keyName]);
    return (
      <div className="meal-row">
        <span className="meal-badge">{label}</span>
        <button type="button" className="meal-input" onClick={() => toggle(keyName)}
          aria-pressed={on} disabled={disabled}>
          {on ? '--' : '食べた'}
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
