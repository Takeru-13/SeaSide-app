// frontend/src/features/records/components/EditModalQuick.tsx
import React from 'react';
import QuickEditForm from './EditForm.quick'; // ← home側を参照
import type { RecordView, UpsertPayload } from '../types';

type Props = {
  value: RecordView;
  onClose: () => void;
  onSave: (patch: UpsertPayload) => Promise<void>;
  className?: string;
};

export default function EditModalQuick({ value, onClose, onSave, className }: Props) {
  if (!value) return null;
  return (
    <div className={`modal-overlay ${className ?? ''}`} role="dialog" aria-modal="true">
      <div className="modal-sheet">
        <QuickEditForm initial={value} onCancel={onClose} onSave={onSave} />
      </div>
    </div>
  );
}

