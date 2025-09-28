// features/records/datail/components/editFormSections/EmotionSlider.tsx
import type { SectionProps } from '../../types';

export default function EmotionSlider({ value, onChange, disabled }: SectionProps<number>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    // 入力を 1..10 の整数にクランプ
    const n = Math.min(10, Math.max(1, Math.round(Number(e.target.value))));
    onChange(n);
  };

  return (
    <section>
      <h4>感情</h4>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-label="感情スコア（1から10）"
      />
      <div>現在: {value}</div>
    </section>
  );
}

