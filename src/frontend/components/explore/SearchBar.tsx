import { Search } from 'lucide-react';
export default function SearchBar({ onSearch, value }: { onSearch: (query: string) => void; value: string }) {
  return <form role="search" onSubmit={event => { event.preventDefault(); onSearch(value); }} className="mb-4">
    <label className="sr-only" htmlFor="tour-search">Search destinations, tours, or activities</label>
    <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand" /><input id="tour-search" type="search" className="field pl-10" placeholder="Search destinations, tours, or activities…" value={value} onChange={event => onSearch(event.target.value)} /></div>
  </form>;
}
