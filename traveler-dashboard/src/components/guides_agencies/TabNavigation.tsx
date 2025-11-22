import { motion } from 'framer-motion';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit"
    >
      <button
        onClick={() => setActiveTab('guides')}
        className={`px-6 py-2.5 rounded-md font-medium transition-all ${
          activeTab === 'guides'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Local Guides
      </button>
      <button
        onClick={() => setActiveTab('agencies')}
        className={`px-6 py-2.5 rounded-md font-medium transition-all ${
          activeTab === 'agencies'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Travel Agencies
      </button>
    </motion.div>
  );
};

export default TabNavigation;