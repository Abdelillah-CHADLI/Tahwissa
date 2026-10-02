import TourCard from '../explore/TourCard';
import type { Tour } from '../../types/explore';

interface ToursSectionProps {
  guideName: string;
  tours: Tour[];
  onTourClick: (tour: Tour) => void; 
  loading?: boolean;
}

const ToursSection = ({ guideName, tours, onTourClick, loading = false }: ToursSectionProps) => {
  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Available Tours</h2>
          <p className="text-gray-600">Loading tours offered by {guideName}...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Available Tours</h2>
        <p className="text-gray-600">Browse tours offered by {guideName}</p>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No tours available</div>
          <p className="text-gray-500">This provider hasn't added any tours yet.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ToursSection;