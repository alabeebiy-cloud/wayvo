import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { Presence } from './Presence';
import { cx } from '../../utils/cx';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface ToastItem { id: string; type: ToastType; message: string }

const STYLES: Record<ToastType, { icon: React.ReactNode; classes: string }> = {
  success: { icon: <CheckCircle2 className="h-5 w-5 text-brand-600" aria-hidden="true" />, classes: 'border-brand-200' },
  error: { icon: <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />, classes: 'border-red-200' },
  warning: { icon: <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />, classes: 'border-amber-200' },
  info: { icon: <Info className="h-5 w-5 text-ink-500" aria-hidden="true" />, classes: 'border-ink-200' },
};

export const ToastViewport: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => (
  <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
    <Presence>
      {toasts.map((t) => (
        <motion.div
          key={t.id} layout
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
          className={cx('pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-pop', STYLES[t.type].classes)}
        >
          {STYLES[t.type].icon}
          <p className="flex-1 text-sm font-medium text-ink-900">{t.message}</p>
          <button type="button" onClick={() => onDismiss(t.id)} aria-label="Dismiss notification" className="rounded p-0.5 text-ink-500 hover:bg-ink-100">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      ))}
    </Presence>
  </div>
);