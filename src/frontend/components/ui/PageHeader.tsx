import type { ReactNode } from 'react';

export function PageHeader({ title, description, eyebrow, actions }: { title: string; description?: ReactNode; eyebrow?: string; actions?: ReactNode }) {
  return <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0 max-w-2xl">
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>}
      <h1 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>;
}
