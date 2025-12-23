import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportStatsCards } from '../../components/admin/reports/ReportStatsCards';
import { ReportSearchBar } from '../../components/admin/reports/ReportSearchBar';
import { ReportsTable } from '../../components/admin/reports/ReportsTable';
import type { Report } from '../../components/admin/reports/ReportsTable';
import { getPostReports, getAccReports, getPostReportDetails, getAccReportDetails } from '../../services/adminService';

export function ReportsManagement() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [allReports, setAllReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const [postData, accData] = await Promise.all([
                getPostReports(),
                getAccReports()
            ]);

            console.log('Raw post reports:', postData);
            console.log('Raw account reports:', accData);

            const postDetailsPromises = postData.reports.map((report: any) =>
                getPostReportDetails(report.report_id)
                    .then(result => {
                        console.log(`Post report ${report.report_id} RAW RESPONSE:`, result);
                        return result;
                    })
                    .catch(err => {
                        console.error(`Failed to fetch details for post report ${report.report_id}:`, err.response?.data || err.message);
                        return null;
                    })
            );
            const accDetailsPromises = accData.reports.map((report: any) =>
                getAccReportDetails(report.report_id)
                    .then(result => {
                        console.log(`Post report ${report.report_id} RAW RESPONSE:`, result);
                        return result;
                    })
                    .catch(err => {
                        console.error(`Failed to fetch details for account report ${report.report_id}:`, err.response?.data || err.message);
                        return null;
                    })
            );

            const [postDetails, accDetails] = await Promise.all([
                Promise.all(postDetailsPromises),
                Promise.all(accDetailsPromises)
            ]);

            const formattedPostReports: Report[] = postData.reports.map((report: any, index: number) => {
                const details = postDetails[index]?.report;
                console.log(`Formatting post report ${report.report_id}:`, { report, details });

                return {
                    id: `post-${report.report_id}`,
                    reportId: report.report_id,
                    reportType: 'post',
                    message: report.report_message || '',
                    reporterName: details?.reporter_name || 'Unknown',
                    reportedName: details?.post_owner_name || "",
                    postTitle: details?.post_title || (report.post_id ? `Post #${report.post_id}` : 'Post #Deleted'),
                    text: details?.post_text || "",
                    reason: report.reason,
                    location: details?.location || 'Community',
                    date: new Date(report.date).toLocaleDateString('en-US'),
                    status: report.status === 'pending' ? 'open' : 'resolved'
                };
            });

            const formattedAccReports: Report[] = accData.reports.map((report: any, index: number) => {
                const details = accDetails[index]?.report;

                console.log(`Formatting account report ${report.report_id}:`, { report, details });
                return {
                    id: `account-${report.report_id}`,
                    reportId: report.report_id,
                    reportType: 'account',
                    message: report.report_message || '',
                    reporterName: details?.reporter_name || 'Unknown',
                    reportedName: details?.reported_name || 'Unknown',
                    reportedId: report.reported_agency || report.reported_guide || report.reported_traveller,
                    accountType: report.reported_agency ? 'Agency' : report.reported_guide ? 'Guide' : 'Traveller',
                    reason: report.reason as any,
                    location: 'Community',
                    date: new Date(report.date).toLocaleDateString('en-US'),
                    status: report.status === 'pending' ? 'open' : 'resolved'
                };
            });

            console.log('Final formatted reports:', [...formattedPostReports, ...formattedAccReports]);
            setAllReports([...formattedPostReports, ...formattedAccReports]);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    // filter reports 
    const filteredReports = allReports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        return (
            report.reporterName.toLowerCase().includes(searchLower) ||
            report.reportedName.toLowerCase().includes(searchLower) ||
            report.reason.toLowerCase().includes(searchLower)
        );
    });

    //  counts
    const openCount = allReports.filter(r => r.status === 'open').length;
    const resolvedCount = allReports.filter(r => r.status === 'resolved').length;

    const handleViewReport = async (reportId: number, reportType: 'post' | 'account') => {
        console.log('View report clicked, ID:', reportId, 'Type:', reportType);
        const report = allReports.find(r => r.reportId === reportId && r.reportType === reportType);
        console.log('Found report:', report);

        if (!report) {
            alert('Report not found');
            return;
        }

        sessionStorage.setItem('reportDetail', JSON.stringify(report));

        navigate(`/admin/reports/${reportType}/${reportId}`);
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600">Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports Management</h1>
                <p className="text-gray-600">Review and manage user-reported content</p>
            </div>

            {/* Stats Cards */}
            <ReportStatsCards openCount={openCount} resolvedCount={resolvedCount} />

            {/* Search Bar */}
            <ReportSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {/* Reports Table */}
            <ReportsTable reports={filteredReports} onViewReport={handleViewReport} />
        </div>
    );
}
