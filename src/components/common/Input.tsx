import React, { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cx } from '../../utils/cx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

/** Labelled input. type="password" automatically gets a show/hide toggle. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, type = 'text', className, id, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [visible, setVisible] = useState(false);
    const isPassword = type === 'password';
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className={className}>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</label>
        <div className="relative">
          {leftIcon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && visible ? 'text' : type}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cx(
              'h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-300 transition-colors',
              leftIcon ? 'pl-10' : false, isPassword && 'pr-11',
              error ? 'border-red-500' : 'border-ink-200 hover:border-ink-300',
            )}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100"
            >
              {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';