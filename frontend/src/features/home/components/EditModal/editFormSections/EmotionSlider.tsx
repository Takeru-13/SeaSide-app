import type { EmotionRecord, SectionProps } from '../types';


export default function EmotionSlider({ value, onChange }: SectionProps<EmotionRecord>) {
  return (
    <section>
      <h4>感情</h4>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div>{value}</div>
    </section>
  );
}