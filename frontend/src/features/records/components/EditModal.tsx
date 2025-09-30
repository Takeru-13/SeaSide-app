import EditForm from './EditForm';
import type { EditFormValue } from '../types';
import styles from "./editModal.module.css";

export default function EditModal({
  value, onClose, onSave,
}: {
  value: EditFormValue | null;
  onClose: () => void;
  onSave: (v: EditFormValue) => Promise<void>;
}) {
  if (!value) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e)=>e.stopPropagation()}>


        <EditForm initial={value} onCancel={onClose} onSave={onSave} />


        <button className={styles.closeFab} onClick={onClose} aria-label="閉じる">✕</button>
      </div>
    </div>
  );
}
