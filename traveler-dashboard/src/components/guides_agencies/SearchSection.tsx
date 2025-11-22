import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
}

const SearchSection = ({ searchQuery, setSearchQuery, activeTab }: SearchSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-gray-200 rounded-xl p-6 mb-6 bg-white"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={`Search ${activeTab === 'agencies' ? 'agencies' : 'guides'} by name, location, or specialty...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent bg-gray-50"
        />
      </div>
    </motion.div>
  );
};

export default SearchSection;