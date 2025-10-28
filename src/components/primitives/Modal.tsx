import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export default function Modal({ open, onClose, title, children }: PropsWithChildren<ModalProps>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={clsx('relative z-10 w-[36rem] max-w-[90vw] rounded-xl bg-white p-4 shadow-xl outline-none')}>
        {title && <h2 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
