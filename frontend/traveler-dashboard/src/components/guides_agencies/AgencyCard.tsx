import { motion } from 'motion/react';
import { MapPin, Users, CheckCircle2 } from 'lucide-react';

interface AgencyCardProps {
  agency: {
    id: string;
    name: string;
    subtitle: string;
    image: string;
    location: string;
    tours: number;
    teamSize: string;
    verified: boolean;
  };
  index: number;
  onViewProfile: () => void;
}

const AgencyCard = ({ agency, index, onViewProfile }: AgencyCardProps) => {
  return (
    <motion.div
      key={agency.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={agency.image}
          alt={agency.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        {agency.verified && (
          <div className="absolute top-4 right-4 bg-[#c8f688] text-gray-900 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Verified
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{agency.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{agency.subtitle}</p>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{agency.location}</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{agency.tours} tours</span>
          </div>
        </div>

        <div className="flex items-center gap-2 py-3 px-4 bg-gray-50 rounded-lg mb-4">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            Team Size: <span className="font-medium text-gray-900">{agency.teamSize}</span>
          </span>
        </div>

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

export default AgencyCard;