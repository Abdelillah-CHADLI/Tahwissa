import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn" as const
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.1 }
    },
    tap: {
      scale: 0.98
    }
  };

  const chevronVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.03
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 mb-4"
    >
      {(['region', 'category', 'priceRange', 'duration', 'rating'] as const).map((filterType) => (
        <div key={filterType} className="relative">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => toggleDropdown(filterType)}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-[${colors.ui.border.medium}] rounded-lg hover:border-[${colors.primary.teal}] transition-colors`}
          >
            <span className={`text-sm font-medium text-[${colors.ui.text.secondary}]`}>
              {filters[filterType]}
            </span>
            <motion.div
              variants={chevronVariants}
              animate={openDropdown === filterType ? "open" : "closed"}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`w-4 h-4 text-[${colors.ui.text.tertiary}]`} />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {openDropdown === filterType && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`absolute top-full mt-2 w-56 bg-white border border-[${colors.ui.border.medium}] rounded-lg shadow-lg z-20 overflow-hidden`}
              >
                {filterOptions[filterType].map((option, index) => (
                  <motion.button
                    key={option}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    onClick={() => selectOption(filterType, option)}
                    whileHover={{ backgroundColor: `${colors.ui.background.hover}` }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      filters[filterType] === option 
                        ? `bg-[${colors.secondary.green}] text-[${colors.ui.text.primary}]` 
                        : `text-[${colors.ui.text.secondary}]`
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <motion.button 
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`ml-auto flex items-center gap-2 px-6 py-2 bg-[${colors.primary.green}] text-white rounded-lg hover:bg-[${colors.primary.darkTeal}] transition-colors`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium">Filter</span>
      </motion.button>
    </motion.div>
  );
};

export default FilterBar;