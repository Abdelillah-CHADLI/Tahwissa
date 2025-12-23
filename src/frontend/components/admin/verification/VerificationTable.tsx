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
    onViewRequest: (id: number) => void;
}

export function VerificationTable({ requests, onViewRequest }: VerificationTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-600';
            case 'approved':
                return 'bg-green-100 text-green-600';
            case 'rejected':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    if (requests.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No verification requests found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">

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
                                key={request.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                                    {request.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 whitespace-nowrap">
                                        {request.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {request.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {request.registrationDate}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(request.status)}`}>
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onViewRequest(request.id)}
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
