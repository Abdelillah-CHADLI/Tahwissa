const landscapes = [
  { image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', title: 'Desert', caption: 'Wide horizons and quiet nights' },
  { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Mountains', caption: 'Paths worth taking slowly' },
  { image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', title: 'Coast', caption: 'A different pace by the sea' },
];

export default function LandscapeSection() {
  return <section className="bg-white py-14 sm:py-20" aria-labelledby="landscapes-heading">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-8 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-brand">A country to discover</p><h2 id="landscapes-heading" className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">A change of scene, whenever you need one</h2><p className="mt-3 text-sm leading-6 text-muted sm:text-base">From the Sahara to the mountains and the coast, there is always another side of Algeria to explore.</p></div>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">{landscapes.map(landscape => <figure key={landscape.title} className="overflow-hidden rounded-xl bg-brand-ink"><div className="h-48 overflow-hidden sm:h-56"><img src={landscape.image} alt="" loading="lazy" className="h-full w-full object-cover" /></div><figcaption className="p-4 text-white"><strong className="block text-lg font-semibold">{landscape.title}</strong><span className="mt-1 block text-sm text-white/75">{landscape.caption}</span></figcaption></figure>)}</div>
    </div>
  </section>;
}
