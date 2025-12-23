import { Eye } from 'lucide-react';

export interface Report {
    id: string | number;
    reportId: number;
    reportType: 'post' | 'account';
    message: string;
    reporterName: string;
    reportedName: string;
    reportedId?: string;
    accountType?: 'Agency' | 'Guide' | 'Traveller';
    postTitle?: string;
    text?: string;
    reason: 'Spam' | 'Inappropriate Content' | 'Harassment' | 'Other';
    location: string;
    date: string;
    status: 'open' | 'resolved';
}

interface ReportsTableProps {
    reports: Report[];
    onViewReport: (reportId: number, reportType: 'post' | 'account') => void;
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
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reporter Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reported Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {reports.map((report) => (
                            <tr
                                key={report.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                                    {report.reporterName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                    {report.reportedName}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getReasonColor(report.reason)}`}>
                                        {report.reason}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {report.location}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {report.date}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(report.status)}`}>
                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onViewReport(report.reportId, report.reportType)}
                                        className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm font-medium">View</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
