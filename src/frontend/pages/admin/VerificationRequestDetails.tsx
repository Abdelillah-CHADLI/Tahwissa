import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    FileText,
    CheckCircle,
    XCircle,
    Download,
} from "lucide-react";
import { Calendar } from "lucide-react";
import { approveVerification } from '../../services/adminService';

export function VerificationRequestDetails() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState<any>(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('verificationRequestDetail');
        if (storedData) {
            setRequest(JSON.parse(storedData));
        }
    }, []);

    const handleApprove = async () => {
        if (!request) return;

        setLoading(true);
        try {
            console.log('Approving verification for:', request.type, request.actualId);
            await approveVerification(request.type, request.actualId);
            alert('Verification approved successfully!');
            navigate('/admin/verifications');
        } catch (error) {
            console.error('Error approving verification:', error);
            alert('Failed to approve verification');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = () => {
        // reject functionality to be implemented
        alert('Reject functionality not yet implemented');
    };

    const handleDownload = () => {
        if (request?.verificationDocument) {
            window.open(request.verificationDocument, '_blank');
        }
    };

    if (!request) {
        return (
            <div className="p-6">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/verifications')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Verification Request Details</h1>
                        <p className="text-gray-600 text-sm">Review all information before making a decision</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReject}
                        disabled={loading}
                        className="px-6 py-2.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                    >
                        <XCircle className="w-5 h-5" />
                        Reject
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={loading}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Building2 className="w-5 h-5 text-gray-700" />
                            <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Name</label>
                                <p className="text-gray-900 font-medium">{request.name}</p>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Type</label>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700">
                                    {request.type}
                                </span>
                            </div>

                            {request.description && (
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Description</label>
                                    <p className="text-gray-900">{request.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Verification Document */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5 text-gray-700" />
                            <h2 className="text-lg font-bold text-gray-900">Verification Document</h2>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-teal-100 p-3 rounded-lg">
                                    <FileText className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {request.verificationDocument.split('/').pop()}
                                    </p>
                                    <p className="text-sm text-gray-500">Identity verification document</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span className="font-medium">Download</span>
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mt-4">
                            Review the uploaded document to verify the identity and legitimacy of the {request.type?.toLowerCase()}.
                        </p>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Contact Details</h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Email</label>
                                    <p className="text-gray-900">{request.email}</p>
                                </div>
                            </div>

                            {request.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Phone</label>
                                        <p className="text-gray-900">{request.phone}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Registration Date</label>
                                    <p className="text-gray-900">{request.registrationDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
