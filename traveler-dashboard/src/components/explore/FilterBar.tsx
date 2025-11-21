import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { Filters, FilterBarProps } from '../../types/explore';
import { colors } from '../../assets/colors';

const FilterBar = ({ filters, setFilters }: FilterBarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filterOptions = {
    region: ['All Regions', 'Algiers', 'Oran', 'Constantine', 'Tamanrasset', 'Tlemcen'],
    category: ['All Categories', 'Desert Tours', 'Mountain Hiking', 'Coastal Adventures', 'Cultural Tours', 'Historical Sites'],
    priceRange: ['All Budgets', 'Under 5,000 DZD', '5,000 - 10,000 DZD', '10,000 - 20,000 DZD', 'Over 20,000 DZD'],
    duration: ['All Durations', '1-3 Days', '4-7 Days', '1-2 Weeks', 'Over 2 Weeks'],
    rating: ['All Ratings', '4+ Stars', '3+ Stars', '2+ Stars']
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const selectOption = (filterType: keyof Filters, value: string) => {
    setFilters({ ...filters, [filterType]: value });
    setOpenDropdown(null);
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      {(['region', 'category', 'priceRange', 'duration', 'rating'] as const).map((filterType) => (
        <div key={filterType} className="relative">
          <button
            onClick={() => toggleDropdown(filterType)}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-[${colors.ui.border.medium}] rounded-lg hover:border-[${colors.primary.teal}] transition-colors`}
          >
            <span className={`text-sm font-medium text-[${colors.ui.text.secondary}]`}>
              {filters[filterType]}
            </span>
            <ChevronDown className={`w-4 h-4 text-[${colors.ui.text.tertiary}]`} />
          </button>
          {openDropdown === filterType && (
            <div className={`absolute top-full mt-2 w-56 bg-white border border-[${colors.ui.border.medium}] rounded-lg shadow-lg z-20`}>
              {filterOptions[filterType].map((option) => (
                <button
                  key={option}
                  onClick={() => selectOption(filterType, option)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[${colors.ui.background.hover}] ${
                    filters[filterType] === option 
                      ? `bg-[${colors.secondary.green}] text-[${colors.ui.text.primary}]` 
                      : `text-[${colors.ui.text.secondary}]`
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <button 
        className={`ml-auto flex items-center gap-2 px-6 py-2 bg-[${colors.primary.green}] text-white rounded-lg hover:bg-[${colors.primary.darkTeal}] transition-colors`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium">Filter</span>
      </button>
    </div>
  );
};

export default FilterBar;