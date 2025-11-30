import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { TourFilters, FilterBarProps } from '../../types/explore';

const FilterBar = ({ filters, setFilters }: FilterBarProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filterOptions = {
    region: ['All Regions', 'Algiers', 'Oran', 'Constantine', 'Tamanrasset', 'Tlemcen'],
    category: ['All Categories', 'Desert Tours', 'Mountain Hiking', 'Coastal Adventures', 'Cultural Tours', 'Historical Sites'],
    priceRange: ['All Budgets', '<5000', '5000-10000', '10000-20000', '>20000'],
    provider: ['All Providers', 'Guide', 'Agency']
  };

  const getFilterDisplayName = (filterType: keyof TourFilters, value: string): string => {
    if (value.includes('All')) {
      switch (filterType) {
        case 'region': return 'Region';
        case 'category': return 'Category';
        case 'priceRange': return 'Price';
        case 'provider': return 'Provider';
        default: return value.replace('All ', '');
      }
    }
    
    switch (filterType) {
      case 'priceRange':
        return value.replace('<5000', '<5K')
                   .replace('5000-10000', '5-10K')
                   .replace('10000-20000', '10-20K')
                   .replace('>20000', '>20K');
      case 'provider':
        return value;
      default:
        return value;
    }
  };

  const handleFilterSelect = (filterType: keyof TourFilters, value: string) => {
    setFilters({ ...filters, [filterType]: value });
    setActiveFilter(null);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'All Regions' && 
    value !== 'All Categories' && 
    value !== 'All Budgets' && 
    value !== 'All Providers'
  ).length;

  return (
    <div className="mb-4">
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        {(['region', 'category', 'priceRange', 'provider'] as const).map((filterType) => (
          <div key={filterType} className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(activeFilter === filterType ? null : filterType)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 text-sm font-medium ${
                filters[filterType].includes('All') 
                  ? 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50' 
                  : 'bg-[#348086] border-[#348086] text-white shadow-md hover:bg-[#2a6970] hover:border-[#2a6970]'
              }`}
            >
              <span className="whitespace-nowrap">
                {filters[filterType]}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform shrink-0 ${
                activeFilter === filterType ? 'rotate-180' : ''
              } ${filters[filterType].includes('All') ? 'text-gray-500' : 'text-white'}`} />
            </motion.button>

            <AnimatePresence>
              {activeFilter === filterType && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute top-full mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden"
                  style={{ position: 'absolute', zIndex: 50 }}
                >
                  <div className="max-h-60 overflow-y-auto">
                    {filterOptions[filterType].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterSelect(filterType, option)}
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-150 hover:bg-gray-50 border-l-2 ${
                          filters[filterType] === option 
                            ? 'bg-[#f0f8f9] border-[#348086] text-[#348086] font-semibold' 
                            : 'border-transparent text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="whitespace-nowrap">{option}</span>
                          {filters[filterType] === option && (
                            <div className="w-2 h-2 bg-[#348086] rounded-full" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {activeFiltersCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilters({
              region: 'All Regions',
              category: 'All Categories',
              priceRange: 'All Budgets',
              provider: 'All Providers',
            })}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <X className="w-4 h-4" />
            Clear ({activeFiltersCount})
          </motion.button>
        )}
      </div>

      <div className="flex md:hidden items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#348086] text-white rounded-lg text-sm font-medium shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-white text-[#348086] rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
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
              provider: 'All Providers',
            })}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="md:hidden mt-3 flex flex-wrap gap-2">
          {(['region', 'category', 'priceRange', 'provider'] as const).map((filterType) => {
            if (filters[filterType].includes('All')) return null;
            
            return (
              <div
                key={filterType}
                className="px-3 py-1.5 bg-[#348086] text-white rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap"
              >
                <span className="capitalize">{filterType}:</span>
                <span>{getFilterDisplayName(filterType, filters[filterType])}</span>
                <button
                  onClick={() => handleFilterSelect(filterType, `All ${filterType === 'priceRange' ? 'Budgets' : filterType === 'provider' ? 'Providers' : filterType.charAt(0).toUpperCase() + filterType.slice(1) + 's'}`)}
                  className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

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
              <div className="p-4 border-b border-gray-200 bg-[#348086] text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-white text-opacity-90 mt-1">
                    {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
                {(['region', 'category', 'priceRange', 'provider'] as const).map((filterType) => (
                  <div key={filterType}>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 capitalize">
                      {filterType === 'priceRange' ? 'Price Range' : 
                       filterType === 'provider' ? 'Provider Type' : 
                       filterType}
                    </h4>
                    <div className="space-y-2">
                      {filterOptions[filterType].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleFilterSelect(filterType, option)}
                          className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all duration-150 border-l-4 ${
                            filters[filterType] === option 
                              ? 'bg-[#f0f8f9] border-[#348086] text-[#348086] font-semibold' 
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="whitespace-nowrap">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => setFilters({
                        region: 'All Regions',
                        category: 'All Categories',
                        priceRange: 'All Budgets',
                        provider: 'All Providers',
                      })}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className={`${activeFiltersCount > 0 ? 'flex-1' : 'w-full'} bg-[#348086] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#2a6970] transition-colors`}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;