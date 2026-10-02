import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Dialog({ open, onClose, title, description, children, footer, wide = false, busy = false }: {
  open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; footer?: ReactNode; wide?: boolean; busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) { dialog.close(); return; }
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previous; };
  }, [open]);
  return <dialog ref={ref} aria-labelledby={titleId} className={`app-dialog ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
    onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
    onClick={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <div className="border-b border-line px-5 py-4 sm:px-6">
      <div className="flex items-start justify-between gap-4"><h2 id={titleId} className="pt-1.5 text-lg font-semibold text-brand-ink">{title}</h2><button type="button" onClick={onClose} disabled={busy} aria-label="Close dialog" className="icon-button -mr-2"><X size={19} /></button></div>
      {description && <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>}
    </div>
    <div className="p-5 sm:p-6">{children}</div>
    {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-gray-50 px-5 py-4 sm:px-6">{footer}</div>}
  </dialog>;
}
