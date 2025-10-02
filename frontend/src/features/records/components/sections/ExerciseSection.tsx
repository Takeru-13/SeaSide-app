// frontend/src/features/records/components/sections/ExerciseSection.tsx
import { useState } from 'react';
import type { RecordView, UpsertPayload } from '../../types';

type Props = {
  value: RecordView['exercise'];                 // { items: string[] }（現在値）
  onChange: (v: UpsertPayload['exercise']) => void; // { items?: string[] } を想定（パッチ送信用）
  disabled?: boolean;
};

export default function ExerciseSection({ value, onChange, disabled }: Props) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    const t = newItem.trim();
    if (!t || disabled) return;
    onChange({ items: [...value.items, t] });
    setNewItem('');
  };

  const removeItem = (index: number) => {
    if (disabled) return;
    onChange({ items: value.items.filter((_, i) => i !== index) });
  };

  return (
    <div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          placeholder="運動項目を入力"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}  
          disabled={disabled}
          style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button type="button" onClick={addItem} disabled={disabled || !newItem.trim()}>
          追加
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {value.items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              background: '#f0f0f0',
              borderRadius: 16,
              fontSize: 14,
            }}
          >
            <span>{item}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: 16,
                  lineHeight: 1,
                }}
                aria-label={`${item} を削除`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
