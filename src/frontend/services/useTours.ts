import { useState, useCallback } from 'react';
import { tourService } from './api';
import type { Tour, TourFilters } from '../types/explore';
import tourFallbackImage from '../assets/imgs/tour1.jpeg';

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
    const firstImageFromUnknown = (value: any): string | null => {
      if (!value) return null;
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) {
        const first = value[0];
        if (!first) return null;
        if (typeof first === 'string') return first;
        if (typeof first === 'object') {
          const url = (first as any).image_url || (first as any).url || (first as any).publicUrl;
          return typeof url === 'string' && url ? url : null;
        }
      }
      return null;
    };

    const imageUrl =
      firstImageFromUnknown(backendTour?.images) ||
      firstImageFromUnknown(backendTour?.tour_images) ||
      firstImageFromUnknown(backendTour?.photos) ||
      (typeof backendTour?.image === 'string' ? backendTour.image : null) ||
      (typeof backendTour?.image_url === 'string' ? backendTour.image_url : null) ||
      (typeof backendTour?.cover_image === 'string' ? backendTour.cover_image : null) ||
      (typeof backendTour?.picture === 'string' ? backendTour.picture : null) ||
      tourFallbackImage;

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

    const startDate = backendTour.start_date;
    const isEnded = startDate ? new Date(startDate) < new Date(new Date().toDateString()) : false;

    let description = "No description available";
    if (typeof backendTour.tour_details === "string" && backendTour.tour_details.trim()) {
      try {
        const parsed = JSON.parse(backendTour.tour_details);
        if (Array.isArray(parsed) && parsed.length > 0) {
          description = parsed[0]?.description || parsed[0]?.title || backendTour.tour_title || "No description available";
        }
      } catch {
        if (!backendTour.tour_details.startsWith("[") && !backendTour.tour_details.startsWith("{")) {
          description = backendTour.tour_details;
        }
      }
    } else if (typeof backendTour.tour_included === "string" && !backendTour.tour_included.startsWith("[")) {
      description = backendTour.tour_included;
    }

    return {
      id: backendTour.tour_id,
      tour_id: backendTour.tour_id,
      title: backendTour.tour_title,
      tour_title: backendTour.tour_title,
      description,
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
      start_date: backendTour.start_date,
      isEnded,
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

      let backendTours: any[] = [];

      // Use the dedicated search endpoint if we have any search criteria
      if (Object.keys(searchParams).length > 0) {
        backendTours = await tourService.searchTours(searchParams);
      } else {
        // Otherwise, get all tours using the regular endpoint
        backendTours = await tourService.getTours(20);
      }

      const convertedTours = backendTours.map(convertBackendTourToFrontend);
      
  
      setTours(convertedTours);
      
      const shouldHaveMore = Object.keys(searchParams).length === 0 && backendTours.length >= 20;
      setHasMore(shouldHaveMore);
      setCurrentPage(1);

    } catch (err: any) {
      console.error('Error fetching tours:', err);
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
      console.error('Error loading more tours:', err);
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