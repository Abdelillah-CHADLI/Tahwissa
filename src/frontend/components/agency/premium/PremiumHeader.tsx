import { Sparkles } from 'lucide-react';
import { getContextText } from '../../../utils/userContext';

export function PremiumHeader() {
    return (
        <div className="text-center pb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A7B7B]/10 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[#4A7B7B]" />
                <span className="text-sm font-medium text-[#4A7B7B]">Premium Plans</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {getContextText('Grow Your Travel Business', 'Grow Your Tour Guide Career')}
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto">
                {getContextText('Choose the perfect plan to reach more travelers and boost your bookings across Algeria', 'Choose the perfect plan to reach more travelers and boost your tour bookings across Algeria')}
            </p>
        </div>
    );
}