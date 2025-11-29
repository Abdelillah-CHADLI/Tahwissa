import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border border-gray-200 rounded-lg xs:rounded-xl p-4 xs:p-6 mb-4 xs:mb-6 bg-white"
        >
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <Search className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 xs:w-5 xs:h-5" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Search destinations, tours, or activities..."
                        className="w-full pl-9 xs:pl-12 pr-4 py-3 xs:py-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#348086] focus:border-transparent text-sm xs:text-base"
                    />
                </div>
            </form>
        </motion.div>
    );
};

export default SearchBar;