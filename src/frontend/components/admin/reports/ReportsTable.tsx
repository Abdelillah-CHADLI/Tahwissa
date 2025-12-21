import { Eye } from 'lucide-react';

export interface Report {
    id: number;
    reporterName: string;
    postTitle: string;
    reason: 'Spam' | 'Inappropriate Content' | 'Harassment' | 'Other';
    location: string;
    date: string;
    status: 'open' | 'resolved';
}

interface ReportsTableProps {
    reports: Report[];
    onViewReport: (id: number) => void;
}

export function ReportsTable({ reports, onViewReport }: ReportsTableProps) {
    const getReasonColor = (reason: string) => {
        switch (reason) {
            case 'Spam':
                return 'bg-orange-100 text-orange-600';
            case 'Inappropriate Content':
                return 'bg-red-100 text-red-600';
            case 'Harassment':
                return 'bg-purple-100 text-purple-600';
            case 'Other':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'open'
            ? 'bg-red-100 text-red-600'
            : 'bg-green-100 text-green-600';
    };

    if (reports.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No reports found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="col-span-2 text-sm font-semibold text-gray-700">Reporter Name</div>
                <div className="col-span-3 text-sm font-semibold text-gray-700">Reported Post Title</div>
                <div className="col-span-2 text-sm font-semibold text-gray-700">Reason</div>
                <div className="col-span-2 text-sm font-semibold text-gray-700">Location</div>
                <div className="col-span-1 text-sm font-semibold text-gray-700">Date</div>
                <div className="col-span-1 text-sm font-semibold text-gray-700">Status</div>
                <div className="col-span-1 text-sm font-semibold text-gray-700">Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                    >
                        <div className="col-span-2 text-sm text-gray-900 font-medium">
                            {report.reporterName}
                        </div>
                        <div className="col-span-3 text-sm text-gray-900">
                            {report.postTitle}
                        </div>
                        <div className="col-span-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getReasonColor(report.reason)}`}>
                                {report.reason}
                            </span>
                        </div>
                        <div className="col-span-2 text-sm text-gray-600">
                            {report.location}
                        </div>
                        <div className="col-span-1 text-sm text-gray-600">
                            {report.date}
                        </div>
                        <div className="col-span-1">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                        </div>
                        <div className="col-span-1">
                            <button
                                onClick={() => onViewReport(report.id)}
                                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">View</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
