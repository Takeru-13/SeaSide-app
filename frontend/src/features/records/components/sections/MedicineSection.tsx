// frontend/src/features/records/components/sections/MedicineSection.tsx
import { useState } from 'react';
import type { RecordView, UpsertPayload } from '../../types';

type Props = {
  value: RecordView['medicine'];
  onChange: (patch: UpsertPayload['medicine']) => void;
  disabled?: boolean;
};

export default function MedicineSection({ value, onChange, disabled }: Props) {
  const items = value.items ?? [];
  const [newMed, setNewMed] = useState('');

  const addMedicine = () => {
    if (newMed.trim()) {
      onChange({ items: [...items, newMed.trim()] });
      setNewMed('');
    }
  };

  const removeMedicine = (idx: number) => {
    onChange({ items: items.filter((_, i) => i !== idx) });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMedicine();
    }
  };

  return (
    <div className="medicine-content">
      <div className="medicine-tags">
        {items.map((med, i) => (
          <span key={i} className="medicine-tag">
            {med}
            <button
              type="button"
              onClick={() => removeMedicine(i)}
              disabled={disabled}
              className="medicine-tag-remove"
              aria-label="削除"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="medicine-input">
        <input
          type="text"
          value={newMed}
          onChange={(e) => setNewMed(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="薬名を入力"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={addMedicine}
          disabled={disabled}
          className="medicine-add-btn"
          aria-label="追加"
        >
          +
        </button>
      </div>
    </div>
  );
}