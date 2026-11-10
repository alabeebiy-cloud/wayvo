import { useContext } from 'react';
import { ToastApi, ToastContext } from '../context/ToastContext';

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>.');
  return ctx;
}