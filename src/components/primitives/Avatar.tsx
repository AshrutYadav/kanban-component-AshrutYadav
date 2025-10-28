import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { getInitials } from '../../utils/task.utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
}

export default function Avatar({ name, className, ...rest }: Props) {
  return (
    <div
      aria-label={name}
      className={clsx('inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700', className)}
      {...rest}
    >
      {getInitials(name)}
    </div>
  );
}
