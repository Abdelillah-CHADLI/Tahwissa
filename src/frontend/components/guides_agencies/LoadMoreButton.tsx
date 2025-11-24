import { motion } from 'motion/react';

interface LoadMoreButtonProps {
  onClick: () => void;
  visible: boolean;
}

const LoadMoreButton = ({ onClick, visible }: LoadMoreButtonProps) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="flex justify-center mt-8"
    >
      <button
        onClick={onClick}
        className="bg-white border-2 border-[#348086] text-[#348086] hover:bg-[#348086] hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
      >
        Load More
      </button>
    </motion.div>
  );
};

export default LoadMoreButton;