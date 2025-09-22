import EditForm from './EditForm';
import type { EditFormValue } from './types';

export default function EditModal({
  value, onClose, onSave,
}: {
  value: EditFormValue | null;
  onClose: () => void;
  onSave: (v: EditFormValue) => Promise<void>;
}) {
  if (!value) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.2)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,.15)',
        }}
      >
        <EditForm initial={value} onCancel={onClose} onSave={onSave} />
      </div>
    </div>
  );
}
