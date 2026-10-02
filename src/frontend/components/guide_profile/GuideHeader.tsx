import { MapPin, Star, Compass, Building2 } from 'lucide-react';
type Guide = { name: string; specialty: string; location: string; rating?: number | null; toursCount?: number | null; experience: string; image?: string; type?: 'guide' | 'agency'; num_raters?: number };
export default function GuideHeader({ guide }: { guide: Guide }) {
  return <section className="border-b border-line bg-white">
    <div className="page-shell flex items-start gap-4 sm:gap-6">
      {guide.image ? <img src={guide.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-brand-soft"><Building2 className="text-brand" /></div>}
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand">{guide.type === 'agency' ? 'Travel agency' : 'Local guide'}</p>
        <h1 className="break-words text-2xl font-bold text-brand-ink sm:text-3xl">{guide.name}</h1>
        {guide.location && <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500"><MapPin size={15} className="shrink-0" />{guide.location}</p>}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5"><Star size={15} className="text-amber-500" />{guide.num_raters ? `${guide.rating} · ${guide.num_raters} reviews` : 'No reviews yet'}</span>
          <span className="inline-flex items-center gap-1.5"><Compass size={15} />{guide.toursCount ?? 0} tours</span>
          {guide.experience && <span>{guide.experience}</span>}
        </div>
      </div>
    </div>
  </section>;
}
