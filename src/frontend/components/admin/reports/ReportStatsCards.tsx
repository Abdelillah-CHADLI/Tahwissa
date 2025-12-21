import { Flag } from 'lucide-react';

interface ReportStatsCardsProps {
    openCount: number;
    resolvedCount: number;
}

export function ReportStatsCards({ openCount, resolvedCount }: ReportStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Open Reports Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-4 rounded-xl">
                        <Flag className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Open Reports</p>
                        <p className="text-3xl font-bold text-gray-900">{openCount}</p>
                    </div>
                </div>
            </div>

            {/* Resolved Reports Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-xl">
                        <Flag className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Resolved Reports</p>
                        <p className="text-3xl font-bold text-gray-900">{resolvedCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
