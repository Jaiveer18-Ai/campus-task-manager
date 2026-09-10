import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, task, onClose, onConfirm, isDeleting = false }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen || !task) return null;

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
        aria-labelledby="modal-delete-title"
        aria-describedby="modal-delete-desc"
      >
        <div className="modal-header">
          <h2 id="modal-delete-title" className="modal-title" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={20} />
            <span>Confirm Deletion</span>
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Cancel deletion"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p id="modal-delete-desc" style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to remove the task:
          </p>
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontWeight: 600,
            fontSize: '0.925rem',
            color: 'var(--text-primary)'
          }}>
            {task.title}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            This action will remove it from your semester dashboard.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(task.id)}
            id="btn-confirm-delete"
            disabled={isDeleting}
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
