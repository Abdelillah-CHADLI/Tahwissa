import { PageHeader, PageState, Button, Notice } from '../../components/ui';
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
    <div className="min-h-screen bg-canvas">
      <div className="discovery-toolbar">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
          <PageHeader eyebrow="Discover" title="Explore tours & activities" description="Find a trip by destination, interest, budget, or the people leading it." />
          <div className="mt-6">
          <SearchBar onSearch={handleSearch} value={searchQuery} />
          <FilterBar filters={filters} setFilters={handleFilterChange} {...facets} />
          <PopularTags onTagClick={handleTagClick} tags={facets.categories} />
          </div>
        </div>
      </div>

      <div className="page-shell">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted" role="status">{loading ? 'Finding tours…' : `${tours.length} ${tours.length === 1 ? 'tour' : 'tours'} found`}{searchQuery && ` for “${searchQuery}”`}</p>

          {(activeFiltersCount > 0 || searchQuery) && (
            <Button variant="quiet" onClick={handleClearFilters}>Clear search & filters</Button>
          )}
        </div>

        {error && tours.length > 0 && <div className="mb-6"><Notice tone="error">{error} <button className="ml-2 font-semibold underline" onClick={() => refetch(filters, searchQuery)}>Try again</button></Notice></div>}

        {loading && tours.length === 0 ? <PageState kind="loading" title="Finding your next adventure" /> : error && tours.length === 0 ? <PageState kind="error" title="Tours unavailable" description={error} action={<Button onClick={() => refetch(filters, searchQuery)}>Try again</Button>} /> : tours.length === 0 ? <PageState title="No tours match your search" description="Try another destination, category, or budget." action={<Button onClick={handleClearFilters}>Clear all filters</Button>} /> : (
          <>
            <div className="discovery-grid mb-7">
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
                <Button variant="secondary" onClick={loadMore} busy={loading}>Load more tours</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
