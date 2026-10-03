import { ArrowRight, MapPin } from 'lucide-react';
import { ROUTES } from '../../utils/routes';
import homeImg from '../../assets/imgs/home.png';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return <section className="relative isolate flex min-h-[500px] items-center overflow-hidden bg-brand-ink py-16 sm:min-h-[570px]">
    <img src={homeImg} alt="Algerian landscape" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
    <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#153b3d]/95 via-[#153b3d]/75 to-[#153b3d]/25" />
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
      <div className="max-w-2xl">
        <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-accent"><MapPin size={15} aria-hidden="true" /> Discover Algeria</p>
        <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">Find your way to somewhere memorable.</h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">Explore tours across Algeria, meet the people who know each place, and plan a trip that feels like yours.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={() => onNavigate(ROUTES.EXPLORE)} className="button min-h-12 bg-accent px-5 text-brand-ink hover:bg-[#b8e678]">Explore tours <ArrowRight size={18} aria-hidden="true" /></button>
          <button type="button" onClick={() => onNavigate(ROUTES.GUIDES)} className="button min-h-12 border border-white/70 bg-[#153b3d]/40 px-5 text-white hover:bg-white/15">Meet local guides</button>
        </div>
      </div>
    </div>
  </section>;
}
