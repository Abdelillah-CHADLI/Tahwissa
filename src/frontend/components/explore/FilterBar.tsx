import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { Filters, FilterBarProps } from '../../types/explore';

const FilterBar = ({ filters, setFilters }: FilterBarProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filterOptions = {
    region: ['All Regions', 'Algiers', 'Oran', 'Constantine', 'Tamanrasset', 'Tlemcen'],
    category: ['All Categories', 'Desert Tours', 'Mountain Hiking', 'Coastal Adventures', 'Cultural Tours', 'Historical Sites'],
    priceRange: ['All Budgets', 'Under 5,000 DZD', '5,000 - 10,000 DZD', '10,000 - 20,000 DZD', 'Over 20,000 DZD'],
    duration: ['All Durations', '1-3 Days', '4-7 Days', '1-2 Weeks', 'Over 2 Weeks'],
    rating: ['All Ratings', '4+ Stars', '3+ Stars', '2+ Stars']
  };

  const handleFilterSelect = (filterType: keyof Filters, value: string) => {
    setFilters({ ...filters, [filterType]: value });
    setActiveFilter(null);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'All Regions' && value !== 'All Categories' && value !== 'All Budgets' && value !== 'All Durations' && value !== 'All Ratings').length;

  return (
    <div className="mb-4">
      <div className="hidden md:flex items-center gap-2">
        {(['region', 'category', 'priceRange', 'duration', 'rating'] as const).map((filterType) => (
          <div key={filterType} className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(activeFilter === filterType ? null : filterType)}
              className={`flex items-center gap-2 px-3 py-2 bg-white border rounded-lg transition-colors text-sm min-w-[120px] ${
                filters[filterType].includes('All') 
                  ? 'border-gray-300 text-gray-600' 
                  : 'border-[#348086] bg-[#348086] text-white'
              }`}
            >
              <span className="truncate">
                {filters[filterType].replace('All ', '')}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${
                activeFilter === filterType ? 'rotate-180' : ''
              }`} />
            </motion.button>

            <AnimatePresence>
              {activeFilter === filterType && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20 overflow-hidden"
                >
                  {filterOptions[filterType].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterSelect(filterType, option)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                        filters[filterType] === option 
                          ? 'bg-[#cbf492] text-gray-900' 
                          : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {activeFiltersCount > 0 && (
          <button
            onClick={() => setFilters({
              region: 'All Regions',
              category: 'All Categories',
              priceRange: 'All Budgets',
              duration: 'All Durations',
              rating: 'All Ratings',
            })}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex md:hidden items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-[#348086] text-white rounded-lg text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-white text-[#348086] rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </motion.button>

        {activeFiltersCount > 0 && (
          <button
            onClick={() => setFilters({
              region: 'All Regions',
              category: 'All Categories',
              priceRange: 'All Budgets',
              duration: 'All Durations',
              rating: 'All Ratings',
            })}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-50 md:hidden shadow-xl"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
                {(['region', 'category', 'priceRange', 'duration', 'rating'] as const).map((filterType) => (
                  <div key={filterType}>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 capitalize">
                      {filterType === 'priceRange' ? 'Price' : filterType}
                    </h4>
                    <div className="space-y-2">
                      {filterOptions[filterType].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleFilterSelect(filterType, option)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            filters[filterType] === option 
                              ? 'bg-[#348086] text-white' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-[#348086] text-white py-3 rounded-lg font-semibold text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;