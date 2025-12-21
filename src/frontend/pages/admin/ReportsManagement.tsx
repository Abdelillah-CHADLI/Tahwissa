import { useState } from 'react';
import { ReportStatsCards } from '../../components/admin/reports/ReportStatsCards';
import { ReportSearchBar } from '../../components/admin/reports/ReportSearchBar';
import { ReportsTable } from '../../components/admin/reports/ReportsTable';
import type { Report } from '../../components/admin/reports/ReportsTable';

export function ReportsManagement() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - replace with API call later
    const allReports: Report[] = [
        {
            id: 1,
            reporterName: 'Fatima Benali',
            postTitle: 'Amazing Desert Tour Experience',
            reason: 'Spam',
            location: 'Community',
            date: '12/7/2024',
            status: 'open'
        },
        {
            id: 2,
            reporterName: 'Ahmed Mansour',
            postTitle: 'Disappointing Experience with XYZ Tours',
            reason: 'Inappropriate Content',
            location: 'Community',
            date: '12/6/2024',
            status: 'open'
        },
        {
            id: 3,
            reporterName: 'Yasmine Khelifi',
            postTitle: 'Scam Alert - Fake Tour Operator',
            reason: 'Harassment',
            location: 'Community',
            date: '12/5/2024',
            status: 'open'
        },
        {
            id: 4,
            reporterName: 'Rachid Bouazza',
            postTitle: 'Best Hiking Trails in Kabylie',
            reason: 'Other',
            location: 'Community',
            date: '12/4/2024',
            status: 'resolved'
        },
        {
            id: 5,
            reporterName: 'Leila Brahim',
            postTitle: 'Coastal Tour Package - Special Discount',
            reason: 'Spam',
            location: 'Community',
            date: '12/3/2024',
            status: 'resolved'
        }
    ];

    // Filter reports by search term
    const filteredReports = allReports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        return (
            report.reporterName.toLowerCase().includes(searchLower) ||
            report.postTitle.toLowerCase().includes(searchLower) ||
            report.reason.toLowerCase().includes(searchLower)
        );
    });

    // Calculate counts
    const openCount = allReports.filter(r => r.status === 'open').length;
    const resolvedCount = allReports.filter(r => r.status === 'resolved').length;

    const handleViewReport = (id: number) => {
        console.log('View report:', id);
        // TODO: Navigate to report details or open modal
    };

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
