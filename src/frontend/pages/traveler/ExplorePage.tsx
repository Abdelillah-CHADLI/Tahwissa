// pages/traveler/ExplorePage.tsx - Only the useEffect needs updating
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/explore/SearchBar";
import FilterBar from "../../components/explore/FilterBar";
import PopularTags from "../../components/explore/PopularTags";
import TourCard from "../../components/explore/TourCard";
import { useTours } from "../../services/useTours";
import type { TourFilters, Tour } from "../../types/explore";
import { ROUTES } from "../../utils/routes";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TourFilters>({
    region: "All Regions",
    category: "All Categories",
    priceRange: "All Budgets",
    provider: "All Providers",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<number | null>(null);

  const { tours, loading, error, hasMore, loadMore, refetch } = useTours();

  // Initial load
  useEffect(() => {
    refetch(filters, searchQuery);
  }, []); // Empty dependency array for initial load only

  // Search and filter debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      refetch(filters, searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, filters, refetch]);

  const handleViewDetails = (tour: Tour) => {
    const tourId = tour.tour_id || tour.id;
    navigate(`${ROUTES.DETAILS}/${tourId}`, {
      state: { tour },
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: TourFilters) => {
    setFilters(newFilters);
  };

  const handleTagClick = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      category: tag,
    }));
  };

  const handleClearFilters = () => {
    const defaultFilters: TourFilters = {
      region: "All Regions",
      category: "All Categories",
      priceRange: "All Budgets",
      provider: "All Providers",
    };
    setFilters(defaultFilters);
    setSearchQuery("");
    // Trigger refetch immediately when clearing
    refetch(defaultFilters, "");
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== "All Regions" &&
      value !== "All Categories" &&
      value !== "All Budgets" &&
      value !== "All Providers"
  ).length;

  const showLoadMore = hasMore && !searchQuery && activeFiltersCount === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-4">
          <SearchBar onSearch={handleSearch} />
          <FilterBar filters={filters} setFilters={handleFilterChange} />
          <PopularTags onTagClick={handleTagClick} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-2">
              Explore Tours & Activities
            </h1>
            <p className="text-sm xs:text-base text-gray-600">
              {loading ? "Loading..." : `${tours.length} tours found`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {(activeFiltersCount > 0 || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => refetch(filters, searchQuery)}
              className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium hover:bg-red-200"
            >
              Try again
              Try again
            </button>
          </div>
        )}

        {loading && tours.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#348086]"></div>
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tours found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-[#348086] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2a6970] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-6 mb-6">
              {tours.map((tour, index) => (
                <TourCard
                  key={tour.tour_id || tour.id}
                  tour={tour}
                  onClick={() => handleViewDetails(tour)}
                  index={index}
                />
              ))}
            </div>

            {showLoadMore && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-white border-2 border-[#348086] text-[#348086] hover:bg-[#348086] hover:text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 text-sm min-h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Load More
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;