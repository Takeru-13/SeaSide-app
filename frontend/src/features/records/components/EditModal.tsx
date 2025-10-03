// frontend/src/features/records/components/EditModal.tsx
import EditForm from './EditForm';
import type { RecordView, UpsertPayload } from '../types';
import styles from './EditModal.module.css';

type Props = {
  value: RecordView | null;
  onClose: () => void;
  // 差分パッチで保存（PUT /records/:date）
  onSave: (patch: UpsertPayload) => Promise<void>;
};

export default function EditModal({ value, onClose, onSave }: Props) {
  if (!value) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <EditForm initial={value} onCancel={onClose} onSave={onSave} />
        <button className={styles.closeFab} onClick={onClose} aria-label="閉じる">
          <p className={styles.closeFab1}>✕</p>
        </button>
      </div>
    </div>
  );
}