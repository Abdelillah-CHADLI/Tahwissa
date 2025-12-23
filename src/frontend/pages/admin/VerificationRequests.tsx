import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerificationSearchBar } from '../../components/admin/verification/VerificationSearchBar';
import { VerificationTabs } from '../../components/admin/verification/VerificationTabs';
import { VerificationTable } from '../../components/admin/verification/VerificationTable';
import type { VerificationRequest } from '../../components/admin/verification/VerificationTable';
import { getAgencyVerifications, getGuideVerifications } from '../../services/adminService';

export function VerificationRequests() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [allRequests, setAllRequests] = useState<VerificationRequest[]>([]);
    const [rawData, setRawData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        try {
            const [agencyData, guideData] = await Promise.all([
                getAgencyVerifications(),
                getGuideVerifications()
            ]);

            console.log('Agency Data:', agencyData);
            console.log('Guide Data:', guideData);

            const formattedAgencies: VerificationRequest[] = agencyData.requests.map((req: any) => {
                console.log('Agency request:', req);
                return {
                    id: req.verification_id,
                    agencyId: req.agency_id,
                    name: req.agency?.agency_name || 'Unknown Agency',
                    type: 'Agency',
                    email: req.agency?.support_email || 'Not provided',
                    phone: req.agency?.phone_number || 'Not provided',
                    description: req.agency?.agency_description || 'No description available',
                    registrationDate: new Date(req.created_at).toLocaleDateString('en-US'),
                    verificationDocument: req.verification_document,
                    status: req.status.toLowerCase()
                };
            });

            const formattedGuides: VerificationRequest[] = guideData.requests.map((req: any) => {
                console.log('Guide request:', req);
                return {
                    id: req.verification_id,
                    guideId: req.guide_id,
                    name: req.guide?.guide_name || 'Unknown Guide',
                    type: 'Guide',
                    email: req.guide?.support_email || 'Not provided',
                    phone: req.guide?.phone_number || 'Not provided',
                    description: req.guide?.guide_description || 'No description available',
                    registrationDate: new Date(req.created_at).toLocaleDateString('en-US'),
                    verificationDocument: req.verification_document,
                    status: req.status.toLowerCase()
                };
            });

            const allData = [...formattedAgencies, ...formattedGuides];
            setAllRequests(allData);
            setRawData(allData);
        } catch (error) {
            console.error('Error fetching verifications:', error);
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

    const handleViewRequest = (id: number) => {
        const request = rawData.find(r => r.id === id);
        if (!request) {
            console.log('Request not found');
            return;
        }

        const actualId = request.type === 'Agency' ? request.agencyId : request.guideId;
        const type = request.type.toLowerCase();

        const detailData = {
            ...request,
            actualId: actualId
        };

        sessionStorage.setItem('verificationRequestDetail', JSON.stringify(detailData));

        navigate(`/admin/verifications/${type}/${actualId}`);
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600">Loading verifications...</p>
            </div>
        );
    }

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
