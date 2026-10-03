const steps = [
  { title: 'Find your trip', description: 'Browse tours and choose the experience that suits you.' },
  { title: 'Know your host', description: 'Review the guide or agency and see what is included.' },
  { title: 'Send a request', description: 'Ask to book. Your host confirms availability.' },
  { title: 'Share the story', description: 'Help others discover the places you loved.' },
];

export default function ProcessSection() {
  return <section className="bg-canvas py-14 sm:py-20" aria-labelledby="journey-heading">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-8 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-brand">Your journey</p><h2 id="journey-heading" className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">From curiosity to the road</h2></div>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">{steps.map((step, index) => <li key={step.title} className="border-t-2 border-brand/50 pt-4"><span className="text-xs font-bold tabular-nums tracking-widest text-brand">0{index + 1}</span><h3 className="mt-3 text-base font-semibold text-brand-ink">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{step.description}</p></li>)}</ol>
    </div>
  </section>;
}
