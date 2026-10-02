import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ClipboardList, Compass, Home, Menu, MessageSquare, Search, Users, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/routes';

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = [
    { path: ROUTES.HOME, label: 'Home', icon: Home },
    { path: ROUTES.EXPLORE, label: 'Explore', icon: Search },
    { path: ROUTES.GUIDES, label: 'Guides & agencies', icon: Users },
    { path: ROUTES.COMMUNITY, label: 'Community', icon: MessageSquare },
    { path: ROUTES.REQUESTS, label: 'My requests', icon: ClipboardList },
  ];
  const isActive = (path: string) => location.pathname === path || (path === ROUTES.HOME && location.pathname === '/');
  const account = user ? <Link aria-label="Your profile" to={ROUTES.PROFILE} onClick={() => setOpen(false)} className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-semibold text-white">
    {user.profile_picture ? <img src={user.profile_picture} alt="" className="h-full w-full object-cover" /> : (user.firstName?.[0] || user.name?.[0] || 'U').toUpperCase()}
  </Link> : <Link to={ROUTES.SIGN_IN} onClick={() => setOpen(false)} className="button button-primary min-h-9 px-3">Sign in</Link>;
  return <header className="relative z-30 border-b border-line bg-white">
    <a href="#traveler-content" className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:absolute focus:left-4 focus:top-4">Skip to content</a>
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex min-h-16 items-center justify-between gap-4">
        <Link to={ROUTES.HOME} className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-brand-ink"><Compass className="h-7 w-7 text-brand" /><span>Tahwissa</span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">
          {items.map(item => <Link key={item.path} to={item.path} aria-current={isActive(item.path) ? 'page' : undefined} className={`flex min-h-16 items-center gap-1.5 border-b-2 text-sm font-medium transition-colors ${isActive(item.path) ? 'border-brand text-brand' : 'border-transparent text-gray-600 hover:text-brand'}`}><item.icon size={15} />{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-3">
          {user && <button aria-label="Notifications" onClick={() => navigate(ROUTES.NOTIFICATIONS)} className="icon-button"><Bell size={19} /></button>}
          {account}
          <button aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="icon-button lg:hidden">{open ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="grid gap-1 border-t border-line py-3 lg:hidden" onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}>
        {items.map(item => <Link key={item.path} to={item.path} onClick={() => setOpen(false)} aria-current={isActive(item.path) ? 'page' : undefined} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium ${isActive(item.path) ? 'bg-brand-soft text-brand-dark' : 'text-gray-600 hover:bg-gray-50'}`}><item.icon size={18} />{item.label}</Link>)}
      </nav>}
    </div>
  </header>;
}
