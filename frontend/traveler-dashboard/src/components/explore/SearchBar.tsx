import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { colors } from '../../assets/colors';

const SearchBar = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border border-gray-200 rounded-xl p-6 mb-6 bg-white"
        >
            <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-[${colors.neutral.gray[400]}] w-5 h-5`} />
                <input
                    type="text"
                    placeholder="Search destinations, tours, or activities..."
                    className={`w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-[${colors.primary.green}] focus:border-transparent`}
                />
            </div>
        </motion.div>
    );
};

export default SearchBar;