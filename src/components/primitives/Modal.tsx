import type { PropsWithChildren } from 'react';
import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export default function Modal({ open, onClose, title, children }: PropsWithChildren<ModalProps>) {
  const titleId = useId();
  const descId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const focusables = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    first?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusablesNow = Array.from(
        container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      );
      if (focusablesNow.length === 0) return;
      const currentIndex = focusablesNow.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey) {
        if (currentIndex <= 0) {
          e.preventDefault();
          focusablesNow[focusablesNow.length - 1].focus();
        }
      } else {
        if (currentIndex === focusablesNow.length - 1) {
          e.preventDefault();
          focusablesNow[0].focus();
        }
      }
    };
    container.addEventListener('keydown', onKeyDown);
    return () => container.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-describedby={descId} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div ref={containerRef} className={clsx('relative z-10 w-[36rem] max-w-[90vw] rounded-xl bg-white p-4 shadow-xl outline-none')}>
        {title && <h2 id={titleId} className="mb-2 text-lg font-semibold text-neutral-900">{title}</h2>}
        <div id={descId} className="sr-only">Modal dialog</div>
        {children}
      </div>
    </div>
  );
}
