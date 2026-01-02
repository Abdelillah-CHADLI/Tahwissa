import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { TourCard } from '../../types/tourcard';
import { bookingService, tourService } from '../../services/api';
import { getCurrentAgencyUuid, getCurrentProfileType } from '../../utils/session';

export function AgencyTourPrograms() {
    const navigate = useNavigate();
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const profileId = getCurrentAgencyUuid();
            const profileType = getCurrentProfileType();

            if (!profileId || !profileType) {
                setError("Profile ID not found. Please log in.");
                setLoading(false);
                return;
            }

            const filterKey = profileType === 'agency' ? 'agencyId' : 'guideId';
            const [toursData, bookingsResponse] = await Promise.all([
                tourService.getAgencyTours(profileId, profileType),
                bookingService.getBookings({ [filterKey]: profileId })
            ]);

            const bookingsData = bookingsResponse?.success && Array.isArray(bookingsResponse?.data)
                ? bookingsResponse.data
                : Array.isArray(bookingsResponse)
                    ? bookingsResponse
                    : [];

            const bookingCounts: Record<string, number> = {};
            for (const b of bookingsData as any[]) {
                const tourId = String(b?.tour_id ?? b?.tours?.tour_id ?? '');
                if (tourId) bookingCounts[tourId] = (bookingCounts[tourId] || 0) + 1;
            }

            const enriched = (Array.isArray(toursData) ? toursData : []).map((t: any) => {
                const tid = String(t?.tour_id ?? t?.id ?? '');
                return {
                    ...t,
                    bookings_count: bookingCounts[tid] || 0,
                };
            });

            setTours(enriched);
            setError(null);
        } catch (err) {
            setError("Failed to load tour programs.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Local filtering is handled by filteredTours
    };

    const filteredTours = tours.filter(tour =>
        (tour.tour_title || tour.title || '').toLowerCase().includes(query.toLowerCase()) ||
        (tour.location || '').toLowerCase().includes(query.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#375E5E]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Tour Programs</h1>
                <button
                    onClick={() => navigate('/agency/add-tour')}
                    className="flex items-center gap-2 bg-[#375E5E] text-white px-3 py-2 rounded-lg hover:bg-[#2c4b4b] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create New Tour
                </button>
            </div>

            <p className='text-sm text-gray-600'>Manage your tour packages and itineraries</p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            <div className="w-full relative">
                <form onSubmit={handleSubmit} className="w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="Search tour programs..."
                        className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#375E5E]"
                    />
                </form>
            </div>

            <div className="w-full">
                <button className='text-shadow-lg rounded-lg bg-gray-50 w-full p-2 flex items-center justify-center gap-2 border border-gray-300 hover:bg-lime-200 transition-colors'>
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {filteredTours.length === 0 && !error ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No tours found.</p>
                    <button
                        onClick={() => navigate('/agency/add-tour')}
                        className="mt-4 text-[#375E5E] font-medium hover:underline"
                    >
                        Create your first tour
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTours.map(t => (
                        <TourCard
                            key={t.tour_id || t.id}
                            image={t.images?.[0] || t.tour_images?.[0]?.image_url || t.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"}
                            status={t.status || "Active"}
                            category={t.category || "General"}
                            title={t.tour_title || t.title}
                            location={t.location}
                            duration={t.duration}
                            groupSize={t.group_size || t.groupSize}
                            price={t.price}
                            bookings={t.bookings_count || t.bookings || 0}
                            startDate={t.start_date || t.startDate}
                            onEdit={() => navigate(`/agency/edit-tour/${t.tour_id || t.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

