import { PageState, Button } from '../../components/ui';
// pages/traveler/ExplorePage.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/explore/SearchBar";
import FilterBar from "../../components/explore/FilterBar";
import PopularTags from "../../components/explore/PopularTags";
import TourCard from "../../components/explore/TourCard";
import { useTours } from "../../services/useTours";
import type { TourFilters, Tour } from "../../types/explore";
import { ROUTES } from "../../utils/routes";
import { tourService } from '../../services/api';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TourFilters>({
    region: "All Regions",
    category: "All Categories",
    priceRange: "All Budgets",
    provider: "All Providers",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [facets, setFacets] = useState<{ regions: string[]; categories: string[] }>({ regions: [], categories: [] });
  useEffect(() => {
    let active = true;
    // The existing search endpoint returns the catalogue when no criteria are supplied.
    // Facets must stay independent of filtered/paginated results.
    void tourService.searchTours({}).then((rows: Array<{ location?: string; category?: string }>) => {
      const unique = (values: Array<string | undefined>) => [...new Set(values.filter((value): value is string => !!value?.trim()))].sort();
      if (active) setFacets({ regions: unique(rows.map(row => row.location)), categories: unique(rows.map(row => row.category)) });
    }).catch(() => { /* Tour results retain their own retryable error state. */ });
    return () => { active = false; };
  }, []);
  const searchTimeoutRef = useRef<number | null>(null);

  const { tours, loading, error, hasMore, loadMore, refetch } = useTours();

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      refetch(filters, searchQuery);
    }, 300);

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
    const newFilters = {
      ...filters,
      category: tag,
    };
    setFilters(newFilters);
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
      <div className="border-b border-[#dce9e5] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <SearchBar onSearch={handleSearch} value={searchQuery} />
          <FilterBar filters={filters} setFilters={handleFilterChange} {...facets} />
          <PopularTags onTagClick={handleTagClick} tags={facets.categories} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-[#193e41] sm:text-3xl">
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
            <button
              onClick={() => refetch(filters, searchQuery)}
              className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium hover:bg-red-200"
            >
              Try again
            </button>
          </div>
        )}

        {loading && tours.length === 0 ? <PageState kind="loading" title="Finding your next adventure" /> : tours.length === 0 && !error ? <PageState title="No tours match your search" description="Try another destination, category, or budget." action={<Button onClick={handleClearFilters}>Clear all filters</Button>} /> : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
              {tours.map((tour, index) => (
                <TourCard
                  key={tour.tour_id || tour.id}
                  tour={tour}
                  onClick={handleViewDetails} // Just pass the function reference
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
