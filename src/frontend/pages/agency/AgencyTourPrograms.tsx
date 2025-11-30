import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Loader2, AlertCircle} from 'lucide-react';
import {useState, useEffect, type SetStateAction} from "react";
import { tourService } from "../../services/api";
import { TourCard } from '../../types/tourcard';
import { mockTours } from '../../data/mockTours';

interface TourType {
    tour_id?: number;
    id?: number;
    tour_title?: string;
    title?: string;
    location?: string;
    category?: string;
    image?: string;
    status?: string;
    duration?: string;
    group_size?: string;
    groupSize?: string;
    price?: number;
    bookings?: number;
    start_date?: string;
    startDate?: string;
}



export function AgencyTourPrograms() {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [tours, setTours] = useState<TourType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await tourService.getTours();
                if (Array.isArray(response) && response.length > 0) {
                    setTours(response);
                } else if (response?.data && response.data.length > 0) {
                    setTours(response.data);
                } else {
                    setTours(mockTours);
                }
            } catch {
                setTours(mockTours);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTours();
    }, []);

    const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
        setQuery(e.target.value);
    }

    interface SubmitEvent {
        preventDefault: () => void;
    }

    const handleSubmit = async (e: SubmitEvent): Promise<void> => {
        e.preventDefault();
        if (!query.trim()) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await tourService.searchTours({ name: query });
            if (Array.isArray(response)) {
                setTours(response);
            } else {
                setTours(response?.data || []);
            }
        } catch {
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const filteredTours = query 
        ? tours.filter(t => 
            (t.tour_title || t.title || '').toLowerCase().includes(query.toLowerCase()) ||
            (t.location || '').toLowerCase().includes(query.toLowerCase()) ||
            (t.category || '').toLowerCase().includes(query.toLowerCase())
          )
        : tours;

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
            
            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-red-800 font-medium">Error</p>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
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
                    <Filter></Filter>
                    Filter
                </button>
            </div>
            
            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#375E5E]" />
                        <p className="text-gray-600">Loading tours...</p>
                    </div>
                </div>
            ) : filteredTours.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-gray-600">No tours found. Create your first tour!</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTours.map(t => (
                        <TourCard
                            key={t.tour_id || t.id}
                            image={t.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470"}
                            status={t.status || "Active"}
                            category={t.category || "Tour"}
                            title={t.tour_title || t.title || "Untitled Tour"}
                            location={t.location || "Unknown"}
                            duration={t.duration || "N/A"}
                            groupSize={t.group_size || t.groupSize || "N/A"}
                            price={t.price || 0}
                            bookings={t.bookings || 0}
                            startDate={t.start_date || t.startDate || "TBD"}
                            onEdit={() => navigate(`/agency/add-tour`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

