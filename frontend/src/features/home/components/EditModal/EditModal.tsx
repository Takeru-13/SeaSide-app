// features/home/components/EditModal/EditModal.tsx
import { useState } from 'react';
import type { DaySummary, EditPayload } from '../../types';

type Props = {
  target: DaySummary;
  onClose: () => void;
  onSave: (p: EditPayload) => Promise<void> | void;
};

export default function EditModal({ target, onClose, onSave }: Props) {
  const [score, setScore] = useState<number>(target.score ?? 5);
  const [note, setNote] = useState<string>(target.note ?? '');

  return (
    <dialog open style={{ padding:16, borderRadius:8 }}>
      <h3>{target.date} の記録</h3>
      <label>
        スコア(0-10):
        <input
          type="number"
          min={0} max={10}
          value={score}
          onChange={(e)=>setScore(Number(e.target.value))}
        />
      </label>
      <label>
        メモ:
        <textarea value={note} onChange={(e)=>setNote(e.target.value)} />
      </label>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        
        <button onClick={onClose}>キャンセル</button>
        <button onClick={() => onSave({ date: target.date, score, note })}>保存</button>

      </div>
    </dialog>
  );
}
