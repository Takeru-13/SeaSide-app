import { useCallback, useMemo } from 'react';
import type { KeyboardEvent } from 'react';
import type { RecordView, UpsertPayload } from '../../types';

type Props = {
  value: RecordView['medicine'];                  // { items: string[] }（現在値）
  onChange: (patch: UpsertPayload['medicine']) => void; // { items?: string[] }（パッチ）
  disabled?: boolean;
};

export default function MedicineSection({ value, onChange, disabled }: Props) {
  // items のデフォルト配列生成を useMemo に退避して参照を安定化
  const safeItems = useMemo(() => value.items ?? [], [value.items]);

  const setItem = useCallback(
    (idx: number, text: string) => {
      const next = [...safeItems];
      next[idx] = text;
      onChange({ items: next }); // 変更点だけ（今回は items 全体を差し替え）
    },
    [safeItems, onChange],
  );

  const addItem = useCallback(() => {
    onChange({ items: [...safeItems, ''] });
  }, [safeItems, onChange]);

  const removeItem = useCallback(
    (idx: number) => {
      const next = safeItems.filter((_, i) => i !== idx);
      onChange({ items: next });
    },
    [safeItems, onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // 最後の行で Enter → 行を追加
        if (idx === safeItems.length - 1) addItem();
      }
    },
    [safeItems, addItem],
  );

  // 送信前に空要素を除外したい場合は、親でトリム（compact）する想定
  return (
    <section>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
        服薬
      </label>

      <div style={{ display: 'grid', gap: 8 }}>
        {safeItems.length === 0 && (
          <button
            type="button"
            onClick={addItem}
            disabled={disabled}
            style={{ width: 'fit-content' }}
          >
            ＋ 行を追加
          </button>
        )}

        {safeItems.map((v, idx) => (
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
            {idx === safeItems.length - 1 && (
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