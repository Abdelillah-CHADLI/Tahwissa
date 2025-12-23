import { useState, useCallback } from 'react';
import { tourService } from './api';
import type { Tour, TourFilters } from '../types/explore';

interface UseToursReturn {
  tours: Tour[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  loadMore: () => void;
  refetch: (filters?: TourFilters, searchQuery?: string) => void;
  clear: () => void;
}

export const useTours = (): UseToursReturn => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<TourFilters>({
    region: "All Regions",
    category: "All Categories",
    priceRange: "All Budgets",
    provider: "All Providers"
  });
  const [currentSearch, setCurrentSearch] = useState('');

  const convertBackendTourToFrontend = (backendTour: any): Tour => {
    const imageUrl =
      backendTour?.images?.[0] ||
      backendTour?.tour_images?.[0] ||
      backendTour?.photos?.[0] ||
      backendTour?.image ||
      backendTour?.image_url ||
      backendTour?.cover_image ||
      backendTour?.picture ||
      '/src/frontend/assets/imgs/tour1.jpeg';

    const providerInfo = backendTour.agency_id
      ? backendTour.agencies
      : backendTour.guides;

    let rating = 0;
    if (providerInfo?.rating && providerInfo?.num_raters > 0) {
      rating = Math.round((providerInfo.rating / providerInfo.num_raters) * 10) / 10;
    }

    let guideRating = 0;
    if (backendTour.guides?.ratings && backendTour.guides?.num_raters > 0) {
      guideRating = Math.round(
        (backendTour.guides.ratings / backendTour.guides.num_raters) * 10
      ) / 10;
    }

    return {
      id: backendTour.tour_id,
      tour_id: backendTour.tour_id,
      title: backendTour.tour_title,
      tour_title: backendTour.tour_title,
      description:
        backendTour.tour_details ||
        backendTour.tour_included ||
        "No description available",
      price: backendTour.price,
      rating,
      image: imageUrl,
      duration: backendTour.duration
        ? `${backendTour.duration} days`
        : "Flexible",
      location: backendTour.location,
      category: backendTour.category || "General",
      groupSize: backendTour.group_size
        ? `${backendTour.group_size} people`
        : "Flexible",
      guide_id: backendTour.guide_id,
      agency_id: backendTour.agency_id,
      guide: backendTour.guides
        ? {
            name: backendTour.guides.guide_name,
            rating: guideRating,
            toursCount: 0
          }
        : undefined
    };
  };

  const refetch = useCallback(async (filters?: TourFilters, searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      if (filters) setCurrentFilters(filters);
      if (searchQuery !== undefined) setCurrentSearch(searchQuery);

      // Prepare search parameters for the backend POST endpoint
      const searchParams: any = {};
      
      // Add search query to name parameter
      if (searchQuery && searchQuery.trim()) {
        searchParams.name = searchQuery.trim();
      }
      
      // Add filters (only if they're not the default values)
      const actualFilters = filters || currentFilters;
      
      if (actualFilters.region && actualFilters.region !== "All Regions") {
        searchParams.region = actualFilters.region;
      }
      
      if (actualFilters.category && actualFilters.category !== "All Categories") {
        searchParams.category = actualFilters.category;
      }
      
      if (actualFilters.priceRange && actualFilters.priceRange !== "All Budgets") {
        searchParams.budget = actualFilters.priceRange;
      }
      
      if (actualFilters.provider && actualFilters.provider !== "All Providers") {
        searchParams.provider = actualFilters.provider;
      }

      console.log('🎯 Sending search params to backend:', searchParams);

      let backendTours: any[] = [];

      // Use the dedicated search endpoint if we have any search criteria
      if (Object.keys(searchParams).length > 0) {
        backendTours = await tourService.searchTours(searchParams);
      } else {
        // Otherwise, get all tours using the regular endpoint
        backendTours = await tourService.getTours(20);
      }

      console.log('✅ Received tours from backend:', backendTours);

      const convertedTours = backendTours.map(convertBackendTourToFrontend);
      setTours(convertedTours);
      
      // For search results, we typically don't have pagination
      // For initial load without filters, we can load more
      const shouldHaveMore = Object.keys(searchParams).length === 0 && backendTours.length >= 20;
      setHasMore(shouldHaveMore);
      setCurrentPage(1);

    } catch (err: any) {
      console.error('❌ Error fetching tours:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch tours');
      setTours([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentFilters]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const nextPage = currentPage + 1;

      // Only load more if we don't have active filters/search
      const hasActiveSearch = currentSearch && currentSearch.trim();
      const hasActiveFilters = Object.values(currentFilters).some(
        value => !value.includes('All')
      );

      if (hasActiveSearch || hasActiveFilters) {
        setHasMore(false);
        return;
      }

      // For infinite scroll without filters, use getTours with limit
      const limit = 20 * nextPage;
      const moreTours = await tourService.getTours(limit);
      
      if (moreTours.length <= tours.length) {
        setHasMore(false);
      } else {
        const convertedTours = moreTours.map(convertBackendTourToFrontend);
        setTours(convertedTours);
        setCurrentPage(nextPage);
        setHasMore(moreTours.length >= limit);
      }

    } catch (err: any) {
      console.error('❌ Error loading more tours:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load more tours');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, currentFilters, currentSearch, tours.length]);

  const clear = useCallback(() => {
    setTours([]);
    setCurrentPage(1);
    setHasMore(true);
    setCurrentFilters({
      region: "All Regions",
      category: "All Categories",
      priceRange: "All Budgets",
      provider: "All Providers"
    });
    setCurrentSearch('');
    setError(null);
  }, []);

  return {
    tours,
    loading,
    error,
    hasMore,
    currentPage,
    loadMore,
    refetch,
    clear,
  };
};