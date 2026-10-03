import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../utils/routes';

export default function CTASection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <section className="bg-brand-ink py-14 text-white sm:py-18"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">Ready when you are</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">See where Algeria takes you.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/80">Explore tours and find someone local to show you around.</p></div><button type="button" onClick={() => onNavigate(ROUTES.EXPLORE)} className="button min-h-12 self-start bg-accent px-5 text-brand-ink hover:bg-[#b8e678]">Explore tours <ArrowRight size={17} aria-hidden="true" /></button></div></section>;
}
