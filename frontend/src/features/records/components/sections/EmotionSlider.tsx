// frontend/src/features/records/components/sections/EmotionSlider.tsx
import { useId } from 'react';
import type { UpsertPayload } from '../../types';

type Props = {
  value: number;
  onChange: (v: UpsertPayload['emotion']) => void;
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
};

export default function EmotionSlider({
  value,
  onChange,
  className = '',
  showLabel = true,
  disabled,
}: Props) {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Math.min(10, Math.max(1, Math.round(Number(e.target.value))));
    onChange(n);
  };

  return (
    <div className={`emotion-slider-root ${className}`}>
      <input
        id={id}
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
