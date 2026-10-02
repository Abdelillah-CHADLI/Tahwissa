import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { FilterBarProps } from '../../types/explore';

const labels = { region: 'Region', category: 'Category', priceRange: 'Budget (DZD)', provider: 'Provider' };
export default function FilterBar({ filters, setFilters, regions, categories }: FilterBarProps & { regions: string[]; categories: string[] }) {
  const options = {
    region: ['All Regions', ...regions],
    category: ['All Categories', ...categories],
    priceRange: ['All Budgets', '<5000', '5000-10000', '10000-20000', '>20000'],
    provider: ['All Providers', 'Guide', 'Agency'],
  };
  const [open, setOpen] = useState(false);
  const count = Object.values(filters).filter(value => !value.startsWith('All ')).length;
  return <div className="mb-4">
    <button className="button button-secondary md:hidden" aria-expanded={open} aria-controls="tour-filters" onClick={() => setOpen(!open)}><SlidersHorizontal size={16} />Filters{count > 0 ? ` (${count})` : ''}</button>
    <div id="tour-filters" className={`${open ? 'grid' : 'hidden'} mt-4 grid-cols-1 gap-3 sm:grid-cols-2 md:mt-0 md:grid md:grid-cols-4`}>
      {(Object.keys(options) as Array<keyof typeof options>).map(key => <label key={key} className="min-w-0 text-xs font-medium text-gray-500">{labels[key]}<select className={`field mt-1.5 ${filters[key].startsWith('All ') ? '' : 'border-brand text-brand'}`} value={filters[key]} onChange={event => setFilters({ ...filters, [key]: event.target.value })}>{!options[key].includes(filters[key]) && <option>{filters[key]}</option>}{options[key].map(value => <option key={value} value={value}>{value}</option>)}</select></label>)}
    </div>
  </div>;
}
