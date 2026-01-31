import React, { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration: number = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const bgColor = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-amber-50 border-amber-200'
  }[toast.type];

  const textColor = {
    success: 'text-emerald-900',
    error: 'text-rose-900',
    info: 'text-blue-900',
    warning: 'text-amber-900'
  }[toast.type];

  const iconColor = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    info: 'text-blue-600',
    warning: 'text-amber-600'
  }[toast.type];

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
    warning: '⚠'
  };

  return (
    <div
      className={`${bgColor} border rounded-xl px-6 py-4 shadow-lg flex items-start gap-4 pointer-events-auto animate-in slide-in-from-right-4 duration-300`}
      role="alert"
      aria-live="polite"
    >
      <span className={`${iconColor} text-xl flex-shrink-0 font-bold`}>{icons[toast.type]}</span>
      <p className={`${textColor} font-medium flex-1`}>{toast.message}</p>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0 font-bold`}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};
