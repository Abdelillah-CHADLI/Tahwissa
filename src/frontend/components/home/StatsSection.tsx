import { Compass, MapPin, MessageCircle, Users } from 'lucide-react';

const highlights = [
  { icon: MapPin, title: 'Across Algeria', caption: 'Many landscapes, one place to start' },
  { icon: Compass, title: 'Local experiences', caption: 'Tours built around real places' },
  { icon: Users, title: 'People who know', caption: 'Guides and agencies to meet' },
  { icon: MessageCircle, title: 'Traveler stories', caption: 'Ideas from the community' },
];

export default function StatsSection() {
  return <section className="border-b border-line bg-white" aria-label="What you can find on Tahwissa"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-5 gap-y-6 px-4 py-7 sm:grid-cols-4 sm:px-6 sm:py-8">{highlights.map(({ icon: Icon, title, caption }) => <div key={title} className="flex items-start gap-2.5"><Icon size={19} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /><div><h2 className="text-sm font-semibold text-brand-ink">{title}</h2><p className="mt-1 text-xs leading-5 text-muted">{caption}</p></div></div>)}</div></section>;
}
