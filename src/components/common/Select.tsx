import React, { forwardRef, useId } from 'react';
import { cx } from '../../utils/cx';

export interface SelectOption { value: string; label: string }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, className, id, ...rest }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    return (
      <div className={className}>
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cx('h-11 w-full rounded-xl border bg-white px-3 text-sm text-ink-900', error ? 'border-red-500' : 'border-ink-200 hover:border-ink-300')}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p id={`${selectId}-error`} role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';