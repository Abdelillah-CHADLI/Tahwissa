import { Flag } from 'lucide-react';

interface ReportStatsCardsProps {
    openCount: number;
    resolvedCount: number;
}

export function ReportStatsCards({ openCount, resolvedCount }: ReportStatsCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Open Reports */}
            <div className="panel p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                        <Flag className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Open Reports</p>
                        <p className="text-2xl font-bold text-gray-900">{openCount}</p>
                    </div>
                </div>
            </div>

            {/* Resolved Reports */}
            <div className="panel p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Flag className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Resolved Reports</p>
                        <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
