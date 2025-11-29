import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import type { Tour, Filters } from '../types/explore';

interface UseToursResult {
  tours: Tour[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: (filters?: Filters, searchQuery?: string) => void;
}

interface QueryParams {
  page?: number;
  limit?: number;
  region?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

const defaultFilters: Filters = {
  region: 'All Regions',
  category: 'All Categories',
  priceRange: 'All Budgets',
  duration: 'All Durations',
  rating: 'All Ratings',
};

export const useTours = (initialFilters?: Filters, initialSearch?: string): UseToursResult => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const convertFiltersToQueryParams = useCallback((filters: Filters, searchQuery: string, currentPage: number): QueryParams => {
    const params: QueryParams = {
      page: currentPage,
      limit: 10
    };

    if (filters.region !== 'All Regions') {
      params.region = filters.region;
    }

    if (filters.category !== 'All Categories') {
      params.category = filters.category;
    }

    if (filters.priceRange !== 'All Budgets') {
      const priceMapping: Record<string, { min?: number; max?: number }> = {
        'Under 5,000 DZD': { max: 5000 },
        '5,000 - 10,000 DZD': { min: 5000, max: 10000 },
        '10,000 - 20,000 DZD': { min: 10000, max: 20000 },
        'Over 20,000 DZD': { min: 20000 }
      };
      
      const priceRange = priceMapping[filters.priceRange];
      if (priceRange) {
        if (priceRange.min) params.minPrice = priceRange.min;
        if (priceRange.max) params.maxPrice = priceRange.max;
      }
    }

    if (filters.rating !== 'All Ratings') {
      params.minRating = parseFloat(filters.rating);
    }

    if (searchQuery) {
      params.search = searchQuery;
    }

    return params;
  }, []);

  const fetchTours = useCallback(async (filters: Filters, searchQuery: string, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      }

      setError(null);

      const queryParams = convertFiltersToQueryParams(filters, searchQuery, reset ? 1 : page);
      
      const response = await apiClient.getTours(queryParams);
      
      const toursData = response as Tour[];
      
      if (reset) {
        setTours(toursData);
      } else {
        setTours(prev => [...prev, ...toursData]);
      }

      setHasMore(toursData.length === 10);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  }, [convertFiltersToQueryParams, page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const refetch = useCallback((filters?: Filters, searchQuery?: string) => {
    fetchTours(filters || defaultFilters, searchQuery || '', true);
  }, [fetchTours]);

  useEffect(() => {
    fetchTours(initialFilters || defaultFilters, initialSearch || '', true);
  }, [fetchTours, initialFilters, initialSearch]);

  useEffect(() => {
    if (page > 1) {
      fetchTours(initialFilters || defaultFilters, initialSearch || '', false);
    }
  }, [page, fetchTours, initialFilters, initialSearch]);

  return {
    tours,
    loading,
    error,
    hasMore,
    loadMore,
    refetch
  };
};