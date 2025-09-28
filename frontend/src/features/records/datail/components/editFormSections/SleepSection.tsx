import type { SectionProps, SleepRecord } from "../../types";

export default function SleepSection({ value, onChange, disabled }: SectionProps<SleepRecord>) {
  return (
    <section>
      <h4>睡眠</h4>
      <input
        type="time"
        value={value.time}
        onChange={(e) => !disabled && onChange({ time: e.target.value })}
        disabled={disabled}
      />
    </section>
  );
}

