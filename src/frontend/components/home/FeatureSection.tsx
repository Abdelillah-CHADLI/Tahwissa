import { ArrowUpRight, Compass, MessageCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

const features = [
  { icon: Compass, title: 'Discover a place', description: 'Find tours across Algeria, from city walks and mountain trails to the open Sahara.', route: ROUTES.EXPLORE, action: 'Browse tours' },
  { icon: Users, title: 'Meet your host', description: 'Get to know local guides and agencies before choosing who to travel with.', route: ROUTES.GUIDES, action: 'Find a guide' },
  { icon: MessageCircle, title: 'Hear from travelers', description: 'Read firsthand stories and share what made your own trip memorable.', route: ROUTES.COMMUNITY, action: 'Visit the community' },
];

export default function FeaturesSection() {
  return <section className="bg-canvas py-14 sm:py-20" aria-labelledby="discover-heading">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-brand">Travel, your way</p>
        <h2 id="discover-heading" className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">Start with what interests you</h2>
        <p className="mt-3 text-sm leading-6 text-muted sm:text-base">Explore the places, people, and stories that make a journey feel personal.</p>
      </div>
      <div className="grid gap-7 border-t border-line pt-7 sm:grid-cols-3 sm:gap-8">
        {features.map(({ icon: Icon, title, description, route, action }) => <article key={title} className="flex flex-col items-start">
          <Icon size={25} strokeWidth={1.8} className="text-brand" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold text-brand-ink">{title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted">{description}</p>
          <Link to={route} className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark">{action}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </article>)}
      </div>
    </div>
  </section>;
}
