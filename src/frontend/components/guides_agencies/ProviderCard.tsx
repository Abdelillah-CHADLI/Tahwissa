import { BadgeCheck, MapPin } from 'lucide-react';

export interface ProviderCardData {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  location?: string;
  tours?: number;
  verified: boolean;
}

export default function ProviderCard({ provider, kind, onViewProfile }: {
  provider: ProviderCardData;
  kind: 'agency' | 'guide';
  onViewProfile: () => void;
}) {
  return <article className="discovery-card">
    <div className="relative">
      <img src={provider.image} alt={provider.name} className="discovery-card__image" loading="lazy" />
      <span className="absolute left-3 top-3 rounded-md bg-brand-ink/90 px-2.5 py-1 text-xs font-semibold text-white">{kind === 'agency' ? 'Travel agency' : 'Local guide'}</span>
      {provider.verified && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-ink"><BadgeCheck size={14} aria-hidden="true" />Verified</span>}
    </div>
    <div className="discovery-card__body">
      {provider.location && <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted"><MapPin size={14} aria-hidden="true" />{provider.location}</p>}
      <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-brand-ink">{provider.name}</h2>
      <p className="mt-1 text-sm text-muted">{provider.subtitle}</p>
      <div className="discovery-card__footer mt-5">
        <span className="text-sm text-muted">{kind === 'agency' ? `${provider.tours || 0} ${(provider.tours || 0) === 1 ? 'tour' : 'tours'}` : 'Explore profile & tours'}</span>
        <button type="button" onClick={onViewProfile} className="button button-primary" aria-label={`View ${provider.name}'s profile`}>View profile</button>
      </div>
    </div>
  </article>;
}
