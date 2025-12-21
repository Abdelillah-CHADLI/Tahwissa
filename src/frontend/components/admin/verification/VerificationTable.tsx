import { Eye } from 'lucide-react';

export interface VerificationRequest {
    id: number;
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
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="col-span-3 text-sm font-semibold text-gray-700">Name</div>
                <div className="col-span-2 text-sm font-semibold text-gray-700">Type</div>
                <div className="col-span-3 text-sm font-semibold text-gray-700">Email</div>
                <div className="col-span-2 text-sm font-semibold text-gray-700">Registration Date</div>
                <div className="col-span-1 text-sm font-semibold text-gray-700">Status</div>
                <div className="col-span-1 text-sm font-semibold text-gray-700">Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
                {requests.map((request) => (
                    <div
                        key={request.id}
                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                    >
                        <div className="col-span-3 text-sm text-gray-900 font-medium">
                            {request.name}
                        </div>
                        <div className="col-span-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                                {request.type}
                            </span>
                        </div>
                        <div className="col-span-3 text-sm text-gray-600">
                            {request.email}
                        </div>
                        <div className="col-span-2 text-sm text-gray-600">
                            {request.registrationDate}
                        </div>
                        <div className="col-span-1">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                        </div>
                        <div className="col-span-1">
                            <button
                                onClick={() => onViewRequest(request.id)}
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
