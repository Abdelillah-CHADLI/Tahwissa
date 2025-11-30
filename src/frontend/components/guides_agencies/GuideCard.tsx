import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface GuideCardProps {
  guide: {
    id: string;
    name: string;
    subtitle: string;
    image: string;
    verified: boolean;
  };
  index: number;
  onViewProfile: () => void;
}

const GuideCard = ({ guide, index, onViewProfile }: GuideCardProps) => {
  return (
    <motion.div
      key={guide.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={guide.image}
          alt={guide.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        {guide.verified && (
          <div className="absolute top-4 right-4 bg-[#c8f688] text-gray-900 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Verified
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{guide.subtitle}</p>

        <motion.button
          onClick={onViewProfile}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-[#348086] text-white rounded-lg font-medium hover:bg-[#2a6970] transition-colors"
        >
          View Profile
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GuideCard;