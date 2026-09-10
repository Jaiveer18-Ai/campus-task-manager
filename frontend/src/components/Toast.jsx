import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-success" style={{ color: 'var(--success)', flexShrink: 0 }} />;
      case 'danger':
        return <AlertTriangle size={18} className="text-danger" style={{ color: 'var(--danger)', flexShrink: 0 }} />;
      default:
        return <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />;
    }
  };

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast toast-${toast.type || 'info'}`}>
        {getIcon()}
        <span style={{ flex: 1 }}>{toast.message}</span>
        <button
          type="button"
          className="btn-icon"
          style={{ padding: '0.2rem', marginLeft: '0.4rem' }}
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
