import React, { useState, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    // eslint-disable-next-line react-hooks/purity
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed z-50 flex flex-col gap-3 pointer-events-none bottom-6 right-6">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const colors = {
    success: 'border-green-100 bg-white dark:bg-neutral-900',
    error: 'border-red-100 bg-white dark:bg-neutral-900',
    info: 'border-blue-100 bg-white dark:bg-neutral-900',
  };

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 w-80 border shadow-2xl rounded-xl animate-in slide-in-from-right-10 duration-300 ${colors[toast.type]}`}>
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {toast.message}
      </p>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
        <X size={16} />
      </button>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
