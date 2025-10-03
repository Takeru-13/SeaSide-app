// frontend/src/features/records/components/sections/MemoSection.tsx
import type { RecordView, UpsertPayload } from '../../types';

type Props = {
  value: RecordView['memo'];                   // { content: string }
  onChange: (patch: UpsertPayload['memo']) => void; // { content?: string }
  disabled?: boolean;
};

export default function MemoSection({ value, onChange, disabled }: Props) {
  const content = value.content ?? '';

  return (
    <div style={{
      padding: '8px 10px',
      maxWidth: '420px',
          borderRadius: 8,
          resize: 'vertical',
        }}>

      <textarea
        placeholder="自由にメモを記入してください..."
        value={content}
        onChange={(e) => !disabled && onChange({ content: e.target.value })}
        disabled={disabled}
        rows={4}
        maxLength={500}
        style={{
          width: '95%',
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid #ddd',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
      <div style={{ fontSize: 12, color: '#666', textAlign: 'right', marginTop: 4 }}>
        {content.length}/500文字
      </div>
    </div>
  );
}
