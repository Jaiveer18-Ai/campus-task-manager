import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ClearAllConfirmModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '440px' }}
        role="alertdialog" 
        aria-modal="true" 
        aria-labelledby="modal-clear-title"
        aria-describedby="modal-clear-desc"
      >
        <div className="modal-header">
          <h2 id="modal-clear-title" className="modal-title" style={{ color: 'var(--urgent)' }}>
            <AlertTriangle size={20} />
            <span>Reset All Tasks</span>
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p id="modal-clear-desc" style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to delete <strong>all tasks</strong> in your workspace?
          </p>
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--urgent-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '0.85rem',
            color: 'var(--urgent-text)'
          }}>
            ⚠️ This will clear all active and completed tasks from local storage.
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            id="btn-confirm-clear-all"
          >
            <Trash2 size={15} />
            <span>Clear All Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
}
