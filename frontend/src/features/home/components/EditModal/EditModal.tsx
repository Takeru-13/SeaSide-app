// ダイアログ表示・閉じる制御
// EditForm を呼び出して onSave に結果を渡す

import EditForm from "./EditForm";
import type { EditFormValue } from './types';

type Props = {
  date: string;
  open: boolean;
  initial?: Partial<EditFormValue>;
  onClose: () => void;
  onSave: (v: EditFormValue) => void;
};


export default function EditModal({ date, open, initial, onClose, onSave }: Props) {
  if (!open) return null;

  return (
    <dialog open style={{ padding: 16, borderRadius: 8 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3>{date} の記録</h3>
        <button onClick={onClose} aria-label="close">×</button>
      </header>

      <EditForm
        date={date}
        initial={initial}
        onSubmit={onSave}
      />
    </dialog>
  );
}