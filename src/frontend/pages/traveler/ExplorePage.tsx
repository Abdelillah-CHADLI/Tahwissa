import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/explore/SearchBar';
import FilterBar from '../../components/explore/FilterBar';
import PopularTags from '../../components/explore/PopularTags';
import TourCard from '../../components/explore/TourCard';
import { mockTours } from '../../data/tours';
import type { Filters } from '../../types/explore';
import { ROUTES } from '../../utils/routes';

const ITEMS_PER_LOAD = 4;

const ExplorePage = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<Filters>({
    region: 'All Regions',
    category: 'All Categories',
    priceRange: 'All Budgets',
    duration: 'All Durations',
    rating: 'All Ratings',
  });

  const [visibleTours, setVisibleTours] = useState(mockTours.slice(0, ITEMS_PER_LOAD));

  const handleViewDetails = () => {
    navigate(ROUTES.DETAILS);
  };

  const handleAddMoreTours = () => {
    const nextTours = mockTours.slice(visibleTours.length, visibleTours.length + ITEMS_PER_LOAD);
    setVisibleTours(prev => [...prev, ...nextTours]);
  };

  const hasMoreTours = visibleTours.length < mockTours.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <SearchBar />
          <FilterBar filters={filters} setFilters={setFilters} />
          <PopularTags />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Tours & Activities</h1>
          <p className="text-gray-600">Discover amazing experiences across Algeria</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visibleTours.map(tour => (
            <TourCard key={tour.id} tour={tour} onClick={handleViewDetails} />
          ))}
        </div>

        {hasMoreTours && (
          <div className="flex justify-center">
            <button
              onClick={handleAddMoreTours}
              className="bg-white border-2 border-[#348086] text-[#348086] hover:bg-[#348086] hover:text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Load More Tours
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
