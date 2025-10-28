import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
}

export default function Button({ variant = 'primary', size = 'md', className, ...props }: Props) {
  const classes = clsx(
    'inline-flex items-center justify-center rounded-md font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
    size === 'sm' ? 'px-2.5 py-1.5 text-sm' : 'px-3.5 py-2 text-sm',
    variant === 'primary'
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'bg-transparent text-neutral-900 hover:bg-neutral-100',
    className
  );
  return <button className={classes} {...props} />;
}
