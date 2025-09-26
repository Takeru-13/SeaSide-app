// frontend/src/features/home/components/EditModal/editFormSections/MedicineSection.tsx
import { useCallback } from 'react';

type Medicine = { items: string[] };

type Props = {
  value: Medicine;                           // 例: { items: ["ビタミンC", "頭痛薬"] }
  onChange: (next: Medicine) => void;        // 親(EditForm)の state を更新
  disabled?: boolean;
};

export default function MedicineSection({ value, onChange, disabled }: Props) {
  const items = value.items ?? [];

  const setItem = useCallback(
    (idx: number, text: string) => {
      const next = [...items];
      next[idx] = text;
      onChange({ items: next });
    },
    [items, onChange],
  );

  const addItem = useCallback(() => {
    onChange({ items: [...items, ''] });
  }, [items, onChange]);

  const removeItem = useCallback(
    (idx: number) => {
      const next = items.filter((_, i) => i !== idx);
      onChange({ items: next });
    },
    [items, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // 最後の行で Enter → 行を追加
        if (idx === items.length - 1) addItem();
      }
    },
    [items.length, addItem],
  );

  // 送信前に空要素を除外したい場合は、親でトリムする想定（toInput側でやってOK）
  return (
    <section>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
        お薬（1行につき1つ）
      </label>

      <div style={{ display: 'grid', gap: 8 }}>
        {items.length === 0 && (
          <button
            type="button"
            onClick={addItem}
            disabled={disabled}
            style={{ width: 'fit-content' }}
          >
            ＋ 行を追加
          </button>
        )}

        {items.map((v, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={v}
              placeholder="例）ロキソニン"
              onChange={(e) => setItem(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              disabled={disabled}
              style={{ flex: 1, padding: '8px 10px' }}
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              disabled={disabled}
              aria-label="行を削除"
            >
              －
            </button>
            {idx === items.length - 1 && (
              <button
                type="button"
                onClick={addItem}
                disabled={disabled}
                aria-label="行を追加"
              >
                ＋
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
