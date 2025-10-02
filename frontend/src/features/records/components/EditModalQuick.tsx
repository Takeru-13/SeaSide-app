// frontend/src/features/records/components/EditModalQuick.tsx
import React, { useEffect } from 'react';
import QuickEditForm from './EditForm.quick';
import type { RecordView, UpsertPayload } from '../types';
import './EditFormQuick.css';

type Props = {
  value: RecordView;
  onClose: () => void;
  onSave: (patch: UpsertPayload) => Promise<void>;
  className?: string;
};

export default function EditModalQuick({ value, onClose, onSave, className }: Props) {
  if (!value) return null;
  const dateKey = String(value.date).slice(0, 10);

  // 背面スクロールロック（CSSの body.modal-open と連動）
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  return (
    <div
      className={`modal-overlay ${className ?? ''}`}   
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="modal-sheet"                        
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="modal-header">
          <div>
            <h2 className="text-xl font-bold text-white">今日の記録</h2>
            <p className="text-indigo-200 text-sm">
              {new Date(dateKey).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="opacity-80 hover:opacity-100" aria-label="閉じる">×</button>
        </div>

        {/* 本文 */}
        <div className="modal-body">
          <QuickEditForm initial={value} onCancel={onClose} onSave={onSave} />
        </div>

        {/* フッター（飾り） */}
        <div className="modal-footer" />
      </div>
    </div>
  );
}
