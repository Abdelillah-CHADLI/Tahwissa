import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export function AgencyTourPrograms() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Tour Programs</h1>
                <button
                    onClick={() => navigate('/add-tour')}
                    className="flex items-center gap-2 bg-[#375E5E] text-white px-4 py-2 rounded-lg hover:bg-[#2c4b4b] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create New Tour
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No tour programs found. Create your first tour!</p>
            </div>
        </div>
    );
}
