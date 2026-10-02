import { Mail, Phone, MapPin, Globe } from 'lucide-react';
type Guide = { email: string; phone: string; location: string; agency_email?: string; agency_phone?: string; guide_email?: string; guide_phone?: string; emergency_phone?: string; support_email?: string; website?: string; agency_website?: string };
export default function ContactSection({ guide }: { guide: Guide }) {
  const email = guide.support_email || guide.agency_email || guide.guide_email || guide.email;
  const phone = guide.agency_phone || guide.guide_phone || guide.phone;
  const website = guide.website || guide.agency_website;
  const contacts = [
    { label: 'Email', value: email, icon: Mail, href: email.includes('@') ? `mailto:${email}` : undefined },
    { label: 'Phone', value: phone, icon: Phone, href: /\d{5}/.test(phone.replace(/\s/g, '')) ? `tel:${phone.replace(/[^+\d]/g, '')}` : undefined },
    { label: 'Location', value: guide.location || 'Not provided', icon: MapPin },
    ...(website ? [{ label: 'Website', value: website, icon: Globe, href: /^https?:\/\//i.test(website) ? website : undefined }] : []),
    ...(guide.emergency_phone ? [{ label: 'Emergency contact', value: guide.emergency_phone, icon: Phone, href: `tel:${guide.emergency_phone.replace(/[^+\d]/g, '')}` }] : []),
  ];
  return <section className="panel panel-body">
    <h2 className="text-lg font-semibold text-brand-ink">Contact the provider</h2><p className="mt-1 text-sm text-gray-500">Ask about availability, meeting points, or anything you need before your trip.</p>
    <dl className="mt-6 grid gap-6 sm:grid-cols-2">{contacts.map(({ label, value, icon: Icon, href }) => <div key={label} className="flex min-w-0 items-start gap-3"><Icon size={18} className="mt-0.5 shrink-0 text-brand" /><div className="min-w-0"><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{href ? <a href={href} className="text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand" {...(label === 'Website' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{value}</a> : value}</dd></div></div>)}</dl>
  </section>;
}
