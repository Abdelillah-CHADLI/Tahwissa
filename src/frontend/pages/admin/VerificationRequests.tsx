import { mapVerification, type RawVerification } from '../../services/adminModels';
import { Button, PageHeader, PageState, Notice } from '../../components/ui';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerificationSearchBar } from '../../components/admin/verification/VerificationSearchBar';
import { VerificationTabs } from '../../components/admin/verification/VerificationTabs';
import { VerificationTable } from '../../components/admin/verification/VerificationTable';
import type { VerificationRequest } from '../../components/admin/verification/VerificationTable';
import { getAgencyVerifications, getGuideVerifications } from '../../services/adminService';

export function VerificationRequests() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [allRequests, setAllRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);



    const fetchVerifications = async () => {
        setLoading(true); setError('');
        try {
            const [agencyData, guideData] = await Promise.all([
                getAgencyVerifications(),
                getGuideVerifications()
            ]);

            const formattedAgencies = (agencyData.requests as RawVerification[]).map(row => mapVerification(row, 'Agency'));
            const formattedGuides = (guideData.requests as RawVerification[]).map(row => mapVerification(row, 'Guide'));
            const allData = [...formattedAgencies, ...formattedGuides];
            setAllRequests(allData);

        } catch (error) {
            console.error('Error fetching verifications:', error);
            setError('We could not load this page. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // filter verifications
    const filteredByTab = allRequests.filter(request => request.status === activeTab);

    const filteredRequests = filteredByTab.filter(request => {
        const searchLower = searchTerm.toLowerCase();
        return (
            request.name.toLowerCase().includes(searchLower) ||
            request.email.toLowerCase().includes(searchLower) ||
            request.type.toLowerCase().includes(searchLower)
        );
    });

    // counts
    const counts = {
        pending: allRequests.filter(r => r.status === 'pending').length,
        approved: allRequests.filter(r => r.status === 'approved').length,
        rejected: allRequests.filter(r => r.status === 'rejected').length
    };

    const handleViewRequest = (request: VerificationRequest) => {
        const actualId = request.type === 'Agency' ? request.agencyId : request.guideId;
        const type = request.type.toLowerCase();

        const detailData = {
            ...request,
            actualId: actualId
        };

        sessionStorage.setItem('verificationRequestDetail', JSON.stringify(detailData));

        navigate(`/admin/verifications/${type}/${actualId}`);
    };

    useEffect(() => { void fetchVerifications(); }, []);

    if (error) return <PageState kind="error" title="Unable to load verification requests" description={error} action={<Button onClick={() => void fetchVerifications()}>Try again</Button>} />;
    if (loading) {
        return (
            <PageState kind="loading" title="Loading verification requests" />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader title="Verification requests" description="Review provider documents and help travelers find verified hosts." />
            {location.state?.message && <Notice tone="success">{location.state.message}</Notice>}

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
