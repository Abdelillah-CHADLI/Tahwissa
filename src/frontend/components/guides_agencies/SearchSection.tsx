import { Search } from 'lucide-react';

export default function SearchSection({ searchQuery, setSearchQuery, activeTab }: {
  searchQuery: string; setSearchQuery: (query: string) => void; activeTab: string;
}) {
  return <div role="search" className="relative w-full sm:max-w-xl">
    <label htmlFor="provider-search" className="sr-only">Search {activeTab === 'agencies' ? 'agencies' : 'guides'}</label>
    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" aria-hidden="true" />
    <input id="provider-search" type="search" placeholder={`Search ${activeTab === 'agencies' ? 'agencies' : 'guides'} by name or location`} value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className="field pl-10" />
  </div>;
}
