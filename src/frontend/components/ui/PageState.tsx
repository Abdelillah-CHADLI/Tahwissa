import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Compass, Loader2 } from 'lucide-react';

export function PageState({ kind = 'empty', title, description, action, compact = false }: {
  kind?: 'loading' | 'empty' | 'error'; title: string; description?: string; action?: ReactNode; compact?: boolean;
}) {
  const Icon = kind === 'loading' ? Loader2 : kind === 'error' ? AlertCircle : Compass;
  return <section className={`panel ${compact ? 'p-5' : 'px-5 py-10 sm:py-14'}`} role={kind === 'error' ? 'alert' : 'status'} aria-live="polite" aria-busy={kind === 'loading'}>
    <div className="mx-auto max-w-md text-center">
      <Icon aria-hidden="true" className={`mx-auto mb-4 h-7 w-7 ${kind === 'error' ? 'text-red-600' : 'text-brand'} ${kind === 'loading' ? 'animate-spin' : ''}`} />
      <h2 className="text-lg font-semibold text-brand-ink">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
      {kind === 'loading' && <div className="mx-auto mt-6 max-w-xs space-y-2 motion-safe:animate-pulse" aria-hidden="true"><div className="h-2 rounded bg-gray-100" /><div className="mx-auto h-2 w-2/3 rounded bg-gray-100" /></div>}
    </div>
  </section>;
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'success' }) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;
  const color = tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-line bg-brand-soft text-brand-ink';
  return <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-sm leading-6 ${color}`}><Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><div className="min-w-0 break-words">{children}</div></div>;
}
