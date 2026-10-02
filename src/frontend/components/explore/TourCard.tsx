// components/explore/TourCard.tsx
import { motion } from "motion/react";
import { MapPin, Star, Calendar, Users, Building, User } from "lucide-react";
import type { Tour } from "../../types/explore";

// Update the interface to accept full tour object
interface TourCardProps {
  tour: Tour;
  onClick: (tour: Tour) => void; // Change from (tourId: string) to (tour: Tour)
  index?: number;
}

const TourCard = ({ tour, onClick, index = 0 }: TourCardProps) => {
  const tourTitle = tour.tour_title || tour.title;
  const displayPrice = tour.price?.toLocaleString() || "0";

  // Check if tour has ended (start_date in the past)
  const isEnded = tour.isEnded || (tour.start_date ? new Date(tour.start_date) < new Date(new Date().toDateString()) : false);

  // Determine if it's from agency or guide
  const providerType = tour.agency_id
    ? "Agency"
    : tour.guide_id
    ? "Guide"
    : "Provider";
  const providerIcon = tour.agency_id ? (
    <Building className="w-3 h-3" />
  ) : (
    <User className="w-3 h-3" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`bg-white rounded-lg xs:rounded-xl shadow-sm hover:shadow-md overflow-hidden cursor-pointer border border-gray-100 ${isEnded ? 'opacity-75' : ''}`}
    >
      <div className="relative h-40 xs:h-48 overflow-hidden">
        <motion.img
          src={tour.image}
          alt={tourTitle}
          className={`w-full h-full object-cover ${isEnded ? 'grayscale-[30%]' : ''}`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />

        
        {isEnded ? (
          <div className="absolute top-2 xs:top-3 left-2 xs:left-3 flex gap-1">
            <span className="px-2 xs:px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Ended
            </span>
          </div>
        ) : (
          <div className="absolute top-2 xs:top-3 left-2 xs:left-3 flex gap-1">
            <span className="px-2 xs:px-3 py-1 bg-[#348086] text-white text-xs font-medium rounded-full flex items-center gap-1">
              {providerIcon}
              {providerType}
            </span>
          </div>
        )}

        <div className="absolute top-2 xs:top-3 right-2 xs:right-3">
          <span className="px-2 xs:px-3 py-1 bg-[#cbf492] text-gray-900 text-xs font-medium rounded-full">
            {tour.category}
          </span>
        </div>
      </div>

      <div className="p-3 xs:p-4 sm:p-5">
        <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-1 xs:mb-2 line-clamp-2">
          {tourTitle}
        </h3>

        <div className="flex items-center text-gray-600 mb-2 xs:mb-3">
          <MapPin className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
          <span className="text-xs xs:text-sm truncate">{tour.location}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 text-xs xs:text-sm text-gray-600">
          {tour.rating > 0 && <div className="flex items-center">
            <Star className="w-3 h-3 xs:w-4 xs:h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-semibold text-gray-900">{tour.rating}</span>
          </div>}

          <div className="flex items-center">
            <Calendar className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
            <span>{tour.duration}</span>
          </div>

          <div className="flex items-center">
            <Users className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
            <span>{tour.groupSize}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg xs:text-xl font-bold text-[#348086]">
              {displayPrice} DZD
            </span>
            <span className="text-xs text-gray-500 ml-1">/person</span>
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onClick(tour); // Pass the full tour object instead of just ID
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 bg-[#348086] text-white rounded-lg 
                       hover:bg-[#2a6970] transition-colors font-medium text-xs xs:text-sm min-h-9 xs:min-h-[40px]"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
