'use client';

import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  className?: string;
}

type ToastContextType = {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const variantStyles = {
  default: 'bg-white border-gray-200 text-gray-900',
  destructive: 'bg-red-100 border-red-400 text-red-700',
  success: 'bg-green-100 border-green-400 text-green-700',
} as const;

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      className = '',
    }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);

      // Add the new toast
      setToasts((currentToasts) => [
        ...currentToasts,
        { id, title, description, variant, className },
      ]);

      // Remove the toast after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`p-4 rounded-md shadow-lg border max-w-sm ${
            variantStyles[toastItem.variant || 'default']
          } ${toastItem.className || ''} relative`}
        >
          <h4 className="font-medium">{toastItem.title}</h4>
          {toastItem.description && (
            <p className="text-sm opacity-90 mt-1">{toastItem.description}</p>
          )}
          <button
            onClick={() => removeToast(toastItem.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default useToast;
