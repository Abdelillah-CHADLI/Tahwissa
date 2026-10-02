import { mapReport, type RawReport } from '../../services/adminModels';
import { useFeedback } from '../../components/ui/FeedbackProvider';
import { Button, PageHeader, PageState, Notice } from '../../components/ui';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportStatsCards } from '../../components/admin/reports/ReportStatsCards';
import { ReportSearchBar } from '../../components/admin/reports/ReportSearchBar';
import { ReportsTable } from '../../components/admin/reports/ReportsTable';
import type { Report } from '../../components/admin/reports/ReportsTable';
import { getPostReports, getAccReports, getPostReportDetails, getAccReportDetails } from '../../services/adminService';

export function ReportsManagement() {
  const { notify } = useFeedback();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [allReports, setAllReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);



    const fetchReports = async () => {
        setLoading(true); setError('');
        try {
            const [postData, accData] = await Promise.all([
                getPostReports(),
                getAccReports()
            ]);

            const loadDetails = async (row: RawReport, type: 'post' | 'account') => {
                try {
                    const result = await (type === 'post' ? getPostReportDetails(row.report_id) : getAccReportDetails(row.report_id));
                    return mapReport({ ...row, ...result.report }, type);
                } catch { return mapReport(row, type); }
            };
            const reports = await Promise.all([
                ...(postData.reports as RawReport[]).map(row => loadDetails(row, 'post')),
                ...(accData.reports as RawReport[]).map(row => loadDetails(row, 'account')),
            ]);
            setAllReports(reports);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setError('We could not load this page. Please try again.');
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
            notify('Report not found');
            return;
        }

        sessionStorage.setItem('reportDetail', JSON.stringify(report));

        navigate(`/admin/reports/${reportType}/${reportId}`);
    };

    useEffect(() => { void fetchReports(); }, []);

    if (error) return <PageState kind="error" title="Unable to load reports" description={error} action={<Button onClick={() => void fetchReports()}>Try again</Button>} />;
    if (loading) {
        return (
            <PageState kind="loading" title="Loading reports" />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader title="Reports" description="Review reported content and keep the Tahwissa community welcoming." />
            {location.state?.message && <Notice tone="success">{location.state.message}</Notice>}

            {/* Stats Cards */}
            <ReportStatsCards openCount={openCount} resolvedCount={resolvedCount} />

            {/* Search Bar */}
            <ReportSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {/* Reports Table */}
            <ReportsTable reports={filteredReports} onViewReport={handleViewReport} />
        </div>
    );
}
