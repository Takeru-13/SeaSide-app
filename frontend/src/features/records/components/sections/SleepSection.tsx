// frontend/src/features/records/components/sections/SleepSection.tsx
import type { RecordView, UpsertPayload } from '../../types';

type Props = {
  value: RecordView['sleep'];                   // { time: string }
  onChange: (patch: UpsertPayload['sleep']) => void; // { time?: string }
  disabled?: boolean;
};

export default function SleepSection({ value, onChange, disabled }: Props) {
  return (
    <section>
      <input
        type="time"
        value={value.time}
        onChange={(e) => onChange({ time: e.target.value })}
        disabled={disabled}
      />
    </section>
  );
}
