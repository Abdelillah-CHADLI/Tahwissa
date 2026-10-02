type Guide = { about: string; languages?: string[]; certifications: string[]; type?: 'guide' | 'agency'; employeesCount?: number; establishedYear?: number };
export default function AboutSection({ guide }: { guide: Guide }) {
  return <section className="panel panel-body space-y-6">
    <div><h2 className="text-lg font-semibold text-brand-ink">About {guide.type === 'agency' ? 'the agency' : 'your guide'}</h2><p className="mt-3 max-w-3xl whitespace-pre-line break-words text-sm leading-7 text-gray-600">{guide.about || 'This provider has not added a description yet. Visit the Tours or Contact tab to find out more.'}</p></div>
    {(guide.employeesCount !== undefined || guide.establishedYear) && <dl className="flex flex-wrap gap-8 border-t border-line pt-5 text-sm">{guide.employeesCount !== undefined && <div><dt className="text-gray-500">Team</dt><dd className="mt-1 font-medium">{guide.employeesCount} team members</dd></div>}{guide.establishedYear && <div><dt className="text-gray-500">Established</dt><dd className="mt-1 font-medium">{guide.establishedYear}</dd></div>}</dl>}
    {!!guide.languages?.length && <div className="border-t border-line pt-5"><h3 className="text-sm font-semibold">Languages</h3><p className="mt-2 text-sm text-gray-600">{guide.languages.join(' · ')}</p></div>}
    {!!guide.certifications.length && <div className="border-t border-line pt-5"><h3 className="text-sm font-semibold">{guide.type === 'agency' ? 'Services & specializations' : 'Certifications & qualifications'}</h3><ul className="mt-3 list-inside list-disc space-y-2 text-sm text-gray-600">{guide.certifications.map(item => <li key={item}>{item}</li>)}</ul></div>}
  </section>;
}
