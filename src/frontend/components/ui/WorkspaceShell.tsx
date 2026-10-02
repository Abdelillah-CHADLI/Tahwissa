import { useState, type ComponentType } from 'react';
import { Compass, LogOut, Menu } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Dialog } from './Dialog';
import { StatusBadge } from './StatusBadge';

export type WorkspaceNavItem = { path: string; label: string; icon: ComponentType<{ className?: string }>; end?: boolean };

export function WorkspaceShell({ title, accountName, image, verified, items, onLogout }: {
  title: string; accountName: string; image?: string; verified?: boolean; items: WorkspaceNavItem[]; onLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const current = [...items].reverse().find(item => item.end ? location.pathname === item.path : location.pathname.startsWith(item.path));
  const links = <nav aria-label={`${title} navigation`} className="space-y-1">
    {items.map(item => <NavLink key={item.path} to={item.path} end={item.end} onClick={() => setMenuOpen(false)}
      className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-brand text-white' : 'text-gray-600 hover:bg-brand-soft hover:text-brand-ink'}`}>
      <item.icon className="h-4 w-4 shrink-0" />{item.label}
    </NavLink>)}
  </nav>;
  const account = <div className="min-w-0 border-t border-line pt-4">
    <div className="mb-3 flex items-center gap-3 px-2">
      {image ? <img src={image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" /> : <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-bold text-brand">{accountName.slice(0, 2).toUpperCase()}</div>}
      <div className="min-w-0"><p className="truncate text-sm font-semibold text-brand-ink" title={accountName}>{accountName}</p><p className="text-xs text-gray-500">{title}</p></div>
    </div>
    {verified && <div className="mb-3 px-2"><StatusBadge status="verified" /></div>}
    <button onClick={onLogout} className="button button-quiet w-full justify-start text-gray-600"><LogOut size={16} /> Sign out</button>
  </div>;
  return <div className="min-h-screen bg-canvas lg:flex">
    <a href="#workspace-content" className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-white px-4 py-6 lg:flex">
      <Link to={items[0].path} className="mb-8 flex items-center gap-2.5 px-2 text-xl font-bold text-brand-ink"><Compass className="h-7 w-7 text-brand" />Tahwissa</Link>
      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">{title}</p>
      {links}<div className="mt-auto pt-6">{account}</div>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3"><button aria-label="Open workspace navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} className="icon-button lg:hidden"><Menu size={21} /></button><span className="hidden text-sm text-gray-400 sm:inline">{title}</span><span aria-hidden="true" className="hidden text-gray-300 sm:inline">/</span><span className="truncate text-sm font-medium text-brand-ink">{current?.label || 'Tour editor'}</span></div>
        <span className="hidden max-w-52 truncate text-xs text-gray-500 sm:block">{accountName}</span>
      </header>
      <main id="workspace-content" className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main>
    </div>
    <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} title="Tahwissa" description={title}>
      {links}<div className="mt-6">{account}</div>
    </Dialog>
  </div>;
}
