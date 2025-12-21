import { useState } from 'react';
import { VerificationSearchBar } from '../../components/admin/verification/VerificationSearchBar';
import { VerificationTabs } from '../../components/admin/verification/VerificationTabs';
import { VerificationTable } from '../../components/admin/verification/VerificationTable';
import type { VerificationRequest } from '../../components/admin/verification/VerificationTable';

export function VerificationRequests() {
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - replace with API call later
    const allRequests: VerificationRequest[] = [
        {
            id: 1,
            name: 'Desert Dreams Travel Agency',
            type: 'Agency',
            email: 'contact@desertdreams.dz',
            registrationDate: '11/30/2024',
            status: 'pending'
        },
        {
            id: 2,
            name: 'Karim Mansour',
            type: 'Guide',
            email: 'karim.mansour@email.com',
            registrationDate: '12/2/2024',
            status: 'pending'
        },
        {
            id: 3,
            name: 'Ahmed Benali',
            type: 'Guide',
            email: 'ahmed.benali@email.com',
            registrationDate: '12/3/2024',
            status: 'pending'
        },
        {
            id: 4,
            name: 'Sahara Adventures',
            type: 'Agency',
            email: 'info@saharaadventures.dz',
            registrationDate: '11/28/2024',
            status: 'approved'
        },
        {
            id: 5,
            name: 'Fatima Zara',
            type: 'Guide',
            email: 'fatima.zara@email.com',
            registrationDate: '11/25/2024',
            status: 'approved'
        },
        {
            id: 6,
            name: 'Atlas Tours',
            type: 'Agency',
            email: 'contact@atlastours.dz',
            registrationDate: '11/20/2024',
            status: 'rejected'
        }
    ];

    // Filter requests by active tab
    const filteredByTab = allRequests.filter(request => request.status === activeTab);

    // Filter by search term
    const filteredRequests = filteredByTab.filter(request => {
        const searchLower = searchTerm.toLowerCase();
        return (
            request.name.toLowerCase().includes(searchLower) ||
            request.email.toLowerCase().includes(searchLower) ||
            request.type.toLowerCase().includes(searchLower)
        );
    });

    // Count requests by status
    const counts = {
        pending: allRequests.filter(r => r.status === 'pending').length,
        approved: allRequests.filter(r => r.status === 'approved').length,
        rejected: allRequests.filter(r => r.status === 'rejected').length
    };

    const handleViewRequest = (id: number) => {
        console.log('View request:', id);
        // TODO: Navigate to request details or open modal
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Requests</h1>
                <p className="text-gray-600">Review and manage agency and guide verification requests</p>
            </div>

            {/* Search Bar */}
            <VerificationSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            {/* Tabs */}
            <VerificationTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
            />

            {/* Table */}
            <VerificationTable
                requests={filteredRequests}
                onViewRequest={handleViewRequest}
            />
        </div>
    );
}
