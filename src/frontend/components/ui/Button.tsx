import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  busy?: boolean;
};

export function Button({ variant = 'primary', busy = false, className = '', children, disabled, type = 'button', ...props }: Props) {
  return <button {...props} type={type} disabled={disabled || busy} aria-busy={busy || undefined} className={`button button-${variant} ${className}`}>
    {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}{children}
  </button>;
}
