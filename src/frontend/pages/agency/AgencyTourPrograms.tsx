import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter} from 'lucide-react';
import {useState, type SetStateAction} from "react";
import { mockTours } from "../../data/mockTours";
import { TourCard } from '../../types/tourcard';



export function AgencyTourPrograms() {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');

    const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
        setQuery(e.target.value);
    }

    interface SubmitEvent {
        preventDefault: () => void;
    }

    const handleSubmit = (e: SubmitEvent): void => {
        e.preventDefault();
        console.log(query);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockTours.map(t => (
                    <TourCard
                        key={t.id}
                        image={t.image}
                        status={t.status}
                        category={t.category}
                        title={t.title}
                        location={t.location}
                        duration={t.duration}
                        groupSize={t.groupSize}
                        price={t.price}
                        bookings={t.bookings}
                        startDate={t.startDate}
                        onEdit={() => navigate(`/agency/add-tour`)}
                    />
                ))}
            </div>
        </div>
    );
}

