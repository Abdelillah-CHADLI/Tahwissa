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

      const hasActiveFilters = filters && Object.values(filters).some(value =>
        !value.includes('All')
      );

      const apiParams: any = {
        page: 1,
        size: 15
      };

      if (filters?.category && filters.category !== 'All Categories') {
        apiParams.cat = filters.category;
      }

      if (filters?.region && filters.region !== 'All Regions') {
        apiParams.regions = filters.region;
      }

      if (filters?.priceRange && filters.priceRange !== 'All Budgets') {
        const priceRanges: { [key: string]: { min: number; max: number } } = {
          'Under $500': { min: 0, max: 500 },
          '$500 - $1000': { min: 500, max: 1000 },
          '$1000 - $2000': { min: 1000, max: 2000 },
          'Over $2000': { min: 2000, max: 100000 },
        };

        const range = priceRanges[filters.priceRange];
        if (range) {
          apiParams.priceMin = range.min;
          apiParams.priceMax = range.max;
        }
      }

      if (filters?.provider && filters.provider !== 'All Providers') {
        apiParams.provider = filters.provider.toLowerCase();
      }

      let response;

      if (searchQuery || hasActiveFilters) {
        response = await tourService.browseTours(
          apiParams.page,
          apiParams.size,
          {
            cat: apiParams.cat ? [apiParams.cat] : undefined,
            regions: apiParams.regions ? [apiParams.regions] : undefined,
            priceMin: apiParams.priceMin,
            priceMax: apiParams.priceMax,
            provider: apiParams.provider
          }
        );
      } else {
        response = await tourService.browseTours(apiParams.page, apiParams.size);
      }

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tours');
      }

      const backendTours = response.data?.tours || [];
      const convertedTours = backendTours.map(convertBackendTourToFrontend);

      setTours(convertedTours);
      setHasMore(response.data?.pagination?.hasNext || false);
      setCurrentPage(1);

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch tours');
      setTours([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const nextPage = currentPage + 1;

      const hasActiveFilters = Object.values(currentFilters).some(value =>
        !value.includes('All')
      );

      if (currentSearch || hasActiveFilters) {
        setHasMore(false);
        return;
      }

      const response = await tourService.browseTours(nextPage, 10);
      const backendTours = response.data?.tours || [];
      const newTours = backendTours.map(convertBackendTourToFrontend);

      if (newTours.length === 0) {
        setHasMore(false);
      } else {
        setTours(prev => [...prev, ...newTours]);
        setCurrentPage(nextPage);
        setHasMore(response.data?.pagination?.hasNext || false);
      }

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load more tours');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, currentFilters, currentSearch]);

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
