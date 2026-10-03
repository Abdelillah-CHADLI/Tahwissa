import { PageState, StatusBadge } from '../../ui';
import { Eye } from 'lucide-react';

export interface VerificationRequest {
    id: number;
    agencyId?: string;
    guideId?: string;
    name: string;
    type: 'Agency' | 'Guide';
    email: string;
    registrationDate: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface VerificationTableProps {
    requests: VerificationRequest[];
    onViewRequest: (request: VerificationRequest) => void;
}

export function VerificationTable({ requests, onViewRequest }: VerificationTableProps) {
    if (requests.length === 0) {
        return (
            <PageState title="No verification requests" description="Try another status or search term. New provider submissions will appear here." />
        );
    }

    return (
        <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
                <table className="data-table responsive-table" role="table">

                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Registration Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {requests.map((request) => (
                            <tr
                                key={`${request.type}-${request.id}`}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td data-label="Name" className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                                    {request.name}
                                </td>
                                <td data-label="Type" className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 whitespace-nowrap">
                                        {request.type}
                                    </span>
                                </td>
                                <td data-label="Email" className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {request.email}
                                </td>
                                <td data-label="Registered" className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {request.registrationDate}
                                </td>
                                <td data-label="Status" className="px-6 py-4">
                                    <StatusBadge status={request.status} />
                                </td>
                                <td data-label="Action" className="px-6 py-4">
                                    <button
                                        onClick={() => onViewRequest(request)}
                                        className="button button-quiet px-2"
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
