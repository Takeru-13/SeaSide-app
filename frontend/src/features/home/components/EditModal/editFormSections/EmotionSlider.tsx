import { useId } from 'react';
import type { SectionProps } from '../types';

type Props = SectionProps<number> & { className?: string; showLabel?: boolean };

export default function EmotionSlider({
  value, onChange, className = '', showLabel = true, disabled,
}: Props) {
  const id = useId();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Math.min(10, Math.max(1, Math.round(Number(e.target.value))));
    onChange(n);
  };
  return (
    <div className={`emotion-slider-root ${className}`.trim()}>
      <label htmlFor={id} className="sr-only">感情スコア（1〜10）</label>
      <input
        id={id} type="range" min={1} max={10} step={1}
        value={value} onChange={handleChange} aria-label="感情スコア（1から10）"
        disabled={disabled} orient="vertical"
      />
      {showLabel && <div className="emotion-label">現在: {value}</div>}
    </div>
  );
}
