import { motion } from 'framer-motion';
import { MapPin, Star, Calendar } from 'lucide-react';
import type { TourCardProps } from '../../types/explore';
import { colors } from '../../assets/colors';

const TourCard = ({ tour, onClick, index = 0 }: TourCardProps & { index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      
      whileHover={{ y: -8, scale: 1.02 }}
      
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />

        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 bg-[${colors.primary.green}] text-white text-xs font-medium rounded-full`}>
            {tour.category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 bg-[${colors.secondary.green}] text-[${colors.neutral.gray[900]}] text-xs font-medium rounded-full`}>
            Popular
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className={`text-lg font-bold text-[${colors.neutral.gray[900]}] mb-2`}>{tour.title}</h3>

        <div className={`flex items-center text-[${colors.neutral.gray[600]}] mb-3`}>
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{tour.location}</span>
        </div>

        <div className={`flex items-center gap-4 mb-4 text-sm text-[${colors.neutral.gray[600]}]`}>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className={`font-semibold text-[${colors.neutral.gray[900]}]`}>{tour.rating}</span>
          </div>

          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{tour.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className={`text-2xl font-bold text-[${colors.primary.green}]`}>
              {tour.price.toLocaleString()} DZD
            </span>
            <span className={`text-sm text-[${colors.neutral.gray[500]}]`}>/person</span>
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation(); 
              onClick(tour.id);  
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 bg-[${colors.primary.green}] text-white rounded-lg 
                       hover:bg-[${colors.primary.darkTeal}] transition-colors font-medium`}
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;