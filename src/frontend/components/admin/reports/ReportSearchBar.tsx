import { Search } from 'lucide-react';

interface ReportSearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export function ReportSearchBar({ searchTerm, onSearchChange }: ReportSearchBarProps) {
    return (
        <div className="mb-6 max-w-xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand" aria-hidden="true" />
                <input
                    aria-label="Search reports"
                    type="search"
                    placeholder="Search by reporter name, post title, or reason..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="field pl-10"
                />
            </div>
        </div>
    );
}
