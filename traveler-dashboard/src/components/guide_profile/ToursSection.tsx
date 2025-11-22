import TourCard from '../explore/TourCard';
import type { Tour } from '../../types/explore';

interface ToursSectionProps {
  guideName: string;
  tours: Tour[];
  onTourClick: (tourId: string) => void;
}

const ToursSection = ({ guideName, tours, onTourClick }: ToursSectionProps) => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Tours</h1>
        <p className="text-gray-600">Browse tours offered by {guideName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour, index) => (
          <TourCard 
            key={tour.id} 
            tour={tour} 
            onClick={onTourClick}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ToursSection;