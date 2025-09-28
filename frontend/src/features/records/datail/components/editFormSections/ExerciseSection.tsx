import { useState } from 'react';
import type { SectionProps, ExerciseRecord } from '../../types';

export default function ExerciseSection({ value, onChange, disabled }: SectionProps<ExerciseRecord>) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() && !disabled) {
      onChange({
        items: [...value.items, newItem.trim()]
      });
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    if (disabled) return;
    onChange({
      items: value.items.filter((_, i) => i !== index)
    });
  };

  return (
    <div>
      <h4>運動</h4>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          placeholder="運動項目を入力"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
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
              fontSize: 14
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
                  lineHeight: 1
                }}
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

