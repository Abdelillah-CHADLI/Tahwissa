import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { ROUTES } from '../../utils/routes';

export default function Footer() {
  return (
    <footer className="bg-[#193e41] py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold"><Compass size={24} /> Tahwissa</div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            Find local tours, meet guides, and share the places you love around Algeria.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#cbf492]">Discover</h2>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-white/80" aria-label="Footer discovery links">
            <Link to={ROUTES.EXPLORE} className="hover:text-white">Explore tours</Link>
            <Link to={ROUTES.GUIDES} className="hover:text-white">Guides & agencies</Link>
            <Link to={ROUTES.COMMUNITY} className="hover:text-white">Community</Link>
          </nav>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#cbf492]">Your journey</h2>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-white/80" aria-label="Footer account links">
            <Link to={ROUTES.SIGN_IN} className="hover:text-white">Sign in</Link>
            <Link to={ROUTES.SIGN_UP} className="hover:text-white">Create an account</Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-white/20 px-4 pt-5 text-xs text-white/60 sm:px-6">
        © {new Date().getFullYear()} Tahwissa
      </div>
    </footer>
  );
}
