import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { ToastItem, ToastType, ToastViewport } from '../components/common/Toast';

export interface ToastApi {
  notify: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);
const DURATION_MS = 4500;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const notify = useCallback((type: ToastType, message: string) => {
    counter.current += 1;
    const id = `toast-${counter.current}`;
    setToasts((list) => [...list, { id, type, message }]);
    window.setTimeout(() => dismiss(id), DURATION_MS);
  }, [dismiss]);

  const api = useMemo<ToastApi>(() => ({
    notify,
    success: (m) => notify('success', m),
    error: (m) => notify('error', m),
    info: (m) => notify('info', m),
  }), [notify]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};