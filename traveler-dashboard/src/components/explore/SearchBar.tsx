import { Search } from 'lucide-react';
import { colors } from '../../assets/colors';

const SearchBar = () => {
    return (
        <div className="mb-6">
            <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-[${colors.neutral.gray[400]}] w-5 h-5`} />
                <input
                    type="text"
                    placeholder="Search destinations, tours, or activities..."
                    className={`w-full pl-12 pr-4 py-3 border border-[${colors.neutral.gray[300]}] rounded-lg 
                     focus:ring-2 focus:ring-[${colors.primary.green}] focus:border-transparent outline-none`}
                />
            </div>
        </div>
    );
};

export default SearchBar;