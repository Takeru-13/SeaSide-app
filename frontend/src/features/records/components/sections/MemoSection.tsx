import type { SectionProps, MemoRecord } from '../../types';

export default function MemoSection({ value, onChange, disabled }: SectionProps<MemoRecord>) {
  return (
    <div>
      <h4>メモ</h4>
      <textarea
        placeholder="自由にメモを記入してください..."
        value={value.content}
        onChange={(e) => !disabled && onChange({ content: e.target.value })}
        disabled={disabled}
        rows={4}
        maxLength={500}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid #ddd',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />
      <div style={{ fontSize: 12, color: '#666', textAlign: 'right', marginTop: 4 }}>
        {value.content.length}/500文字
      </div>
    </div>
  );
}

