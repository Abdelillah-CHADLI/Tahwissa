import { Search } from 'lucide-react';

interface VerificationSearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export function VerificationSearchBar({ searchTerm, onSearchChange }: VerificationSearchBarProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, or type..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>
        </div>
    );
}
