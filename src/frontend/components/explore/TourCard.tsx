import { CalendarDays, MapPin, Star, Users } from 'lucide-react';
import type { Tour } from '../../types/explore';

interface TourCardProps {
  tour: Tour;
  onClick: (tour: Tour) => void;
  index?: number;
}

export default function TourCard({ tour, onClick }: TourCardProps) {
  const title = tour.tour_title || tour.title;
  const ended = tour.isEnded || (tour.start_date ? new Date(tour.start_date) < new Date(new Date().toDateString()) : false);
  const provider = tour.agency_id ? 'Agency' : tour.guide_id ? 'Local guide' : 'Provider';
  return <article className="discovery-card">
    <div className="relative">
      <img src={tour.image} alt={title} className={`discovery-card__image ${ended ? 'grayscale-[30%]' : ''}`} loading="lazy" />
      <span className="absolute left-3 top-3 rounded-md bg-brand-ink/90 px-2.5 py-1 text-xs font-semibold text-white">{ended ? 'Tour ended' : provider}</span>
      {tour.category && <span className="absolute right-3 top-3 max-w-[50%] truncate rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-ink">{tour.category}</span>}
    </div>
    <div className="discovery-card__body">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted"><MapPin size={14} aria-hidden="true" />{tour.location}</div>
      <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-brand-ink">{title}</h2>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        {tour.rating > 0 && <span className="inline-flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />{tour.rating}</span>}
        {tour.duration && <span className="inline-flex items-center gap-1"><CalendarDays size={14} aria-hidden="true" />{tour.duration}</span>}
        {tour.groupSize && <span className="inline-flex items-center gap-1"><Users size={14} aria-hidden="true" />{tour.groupSize}</span>}
      </div>
      <div className="discovery-card__footer mt-5">
        <div><strong className="block text-lg leading-tight text-brand-ink">{(tour.price || 0).toLocaleString()} DZD</strong><span className="text-xs text-muted">per person</span></div>
        <button type="button" onClick={() => onClick(tour)} className="button button-primary" aria-label={`View details for ${title}`}>View tour</button>
      </div>
    </div>
  </article>;
}
