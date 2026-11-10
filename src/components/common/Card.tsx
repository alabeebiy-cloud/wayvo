import React from 'react';
import { cx } from '../../utils/cx';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={cx('rounded-2xl border border-ink-100 bg-white p-5 shadow-card sm:p-6', className)} {...rest}>
    {children}
  </div>
);