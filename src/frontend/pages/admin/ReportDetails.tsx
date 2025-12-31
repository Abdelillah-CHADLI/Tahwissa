import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    FileText,
    MapPin,
    Calendar,
    Trash2,
    XCircle,
    AlertTriangle,
    Loader2
} from "lucide-react";
import { deletePost, deleteAccount, dismissReport } from '../../services/adminService';

export function ReportDetails() {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<'delete' | 'dismiss' | null>(null);
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('reportDetail');
        if (storedData) {
            setReport(JSON.parse(storedData));
        }
    }, []);

    const handleDeletePost = async () => {
        if (!report || type !== 'post') return;

        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        setActionType('delete');

        try {
            console.log(' Deleting post for report:', report.reportId);

            await deletePost(report.reportId);
            alert('Post deleted successfully!');

            sessionStorage.removeItem('reportDetail');

            navigate('/admin/reports', { replace: true });

        } catch (error) {
            console.error(' Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleDeleteAccount = async () => {
        if (!report || type !== 'account') return;

        if (!confirm('Are you sure you want to delete this account? This action cannot be undone and will permanently remove all associated data.')) {
            return;
        }

        setLoading(true);
        setActionType('delete');

        try {
            console.log('Deleting account for report:', report.reportId);

            await deleteAccount(report.reportId);
            alert('Account deleted successfully!');

            sessionStorage.removeItem('reportDetail');

            navigate('/admin/reports', { replace: true });

        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again.');
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleDismiss = async () => {
        if (!report || !type) return;

        if (!confirm('Are you sure you want to dismiss this report?')) {
            return;
        }

        setLoading(true);
        setActionType('dismiss');

        try {
            console.log(' Dismissing report:', report.reportId, 'Type:', type);

            await dismissReport(report.reportId, type as 'post' | 'account');
            alert('Report dismissed successfully!');

            sessionStorage.removeItem('reportDetail');
            navigate('/admin/reports', { replace: true });

        } catch (error) {
            console.error('Error dismissing report:', error);
            alert('Failed to dismiss report. Please try again.');
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    if (!report) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                    <p className="text-gray-600">Loading report details...</p>
                </div>
            </div>
        );
    }

    const getReasonColor = (reason: string) => {
        switch (reason.toLowerCase()) {
            case 'spam':
            case 'spammer':
                return 'bg-orange-100 text-orange-700';
            case '7agar':
            case 'harassment':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/reports')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
                        <p className="text-gray-600 text-sm">Review report and take appropriate action</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDismiss}
                        disabled={loading}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && actionType === 'dismiss' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <XCircle className="w-5 h-5" />
                        )}
                        {loading && actionType === 'dismiss' ? 'Dismissing...' : 'Dismiss Report'}
                    </button>
                    {type === 'post' && (
                        <button
                            onClick={handleDeletePost}
                            disabled={loading}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && actionType === 'delete' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Trash2 className="w-5 h-5" />
                            )}
                            {loading && actionType === 'delete' ? 'Deleting...' : 'Delete Post'}
                        </button>
                    )}
                    {type === 'account' && (
                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && actionType === 'delete' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Trash2 className="w-5 h-5" />
                            )}
                            {loading && actionType === 'delete' ? 'Deleting...' : 'Delete Account'}
                        </button>
                    )}
                </div>
            </div>

            {/* Report Information */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-bold text-gray-900">Report Information</h2>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Report Type</label>
                        <p className="font-medium text-gray-900">{report.reportType}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Reason</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReasonColor(report.reason)}`}>
                            {report.reason}
                        </span>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Location</label>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900">{report.location}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Report Date</label>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900">{report.date}</span>
                        </div>
                    </div>
                </div>

                {report.message && (
                    <div className="mt-4">
                        <label className="text-sm text-gray-600 block mb-1">Report Message</label>
                        <p className="text-gray-900">{report.message}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reporter Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-bold text-gray-900">Reporter</h2>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Name</label>
                            <p className="font-medium text-gray-900">{report.reporterName}</p>
                        </div>
                    </div>
                </div>

                {/* Post Owner / Reported Account Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-bold text-gray-900">
                            {type === 'post' ? 'Post Owner' : 'Reported Account'}
                        </h2>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Name</label>
                            <p className="font-medium text-gray-900">{report.reportedName}</p>
                        </div>
                    </div>
                </div>

                {/* Post Info for post reports */}
                {type === 'post' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-gray-700" />
                            <h2 className="text-lg font-bold text-gray-900">Post Info</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Title</label>
                                <p className="font-medium text-gray-900">{report.postTitle}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reported Content for post reports */}
            {type === 'post' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-bold text-gray-900">Reported Post Content</h2>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">{report.postTitle}</h3>
                        <p className="text-sm text-gray-600 mb-4">Posted by {report.reportedName}</p>
                        <p className="text-gray-900 leading-relaxed">
                            {report.text || 'No content available'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}