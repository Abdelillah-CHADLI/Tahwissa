import { useState, useCallback } from 'react';
import type { Tour, Filters } from '../types/explore';
import { mockTours } from '../data/tours';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useTours = () => {
    const [tours, setTours] = useState<Tour[]>(mockTours);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [usingMockData, setUsingMockData] = useState(true);

    const filterTours = useCallback((filters: Filters, searchQuery: string): Tour[] => {
        let filtered = [...mockTours];
        if (searchQuery) {
            filtered = filtered.filter(tour =>
                tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (filters.region !== 'All Regions') {
            filtered = filtered.filter(tour =>
                tour.location.toLowerCase().includes(filters.region.toLowerCase())
            );
        }
        if (filters.category !== 'All Categories') {
            filtered = filtered.filter(tour => tour.category === filters.category);
        }
        if (filters.priceRange !== 'All Budgets') {
            filtered = filtered.filter(tour => {
                switch (filters.priceRange) {
                    case 'Under 5,000 DZD':
                        return tour.price < 5000;
                    case '5,000 - 10,000 DZD':
                        return tour.price >= 5000 && tour.price <= 10000;
                    case '10,000 - 20,000 DZD':
                        return tour.price >= 10000 && tour.price <= 20000;
                    case 'Over 20,000 DZD':
                        return tour.price > 20000;
                    default:
                        return true;
                }
            });
        }
        if (filters.duration !== 'All Durations') {
            filtered = filtered.filter(tour => {
                const duration = tour.duration;
                switch (filters.duration) {
                    case '1-3 Days':
                        return duration.includes('Day') && parseInt(duration) <= 3;
                    case '4-7 Days': {
                        const daysMatch = duration.match(/\d+/);
                        const days = daysMatch ? parseInt(daysMatch[0]) : 0;
                        return days >= 4 && days <= 7;
                    }
                    case '1-2 Weeks':
                        return duration.includes('Week') && parseInt(duration) <= 2;
                    case 'Over 2 Weeks':
                        return duration.includes('Week') && parseInt(duration) > 2;
                    default:
                        return true;
                }
            });
        }
        if (filters.rating !== 'All Ratings') {
            filtered = filtered.filter(tour => {
                switch (filters.rating) {
                    case '4+ Stars':
                        return tour.rating >= 4;
                    case '3+ Stars':
                        return tour.rating >= 3;
                    case '2+ Stars':
                        return tour.rating >= 2;
                    default:
                        return true;
                }
            });
        }
        return filtered;
    }, []);

    const refetch = useCallback(async (filters: Filters, searchQuery: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/tours`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filters, searchQuery })
            });

            if (response.ok) {
                const data = await response.json();
                setTours(data.tours);
                setHasMore(data.hasMore || false);
                setUsingMockData(false); // Successfully using real backend
            } else {
                throw new Error('Backend not available');
            }

        } catch {
            console.log('Using mock data - backend not available');
            await new Promise(resolve => setTimeout(resolve, 500));
            const filteredTours = filterTours(filters, searchQuery);
            setTours(filteredTours);
            setHasMore(false);
            setUsingMockData(true);

        } finally {
            setLoading(false);
        }
    }, [filterTours]);

    const loadMore = useCallback(async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        setHasMore(false);
    }, []);

    return {
        tours,
        loading,
        error,
        hasMore,
        loadMore,
        refetch,
        usingMockData 
    };
};