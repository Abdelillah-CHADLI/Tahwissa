import { Button, PageHeader, PageState, Notice } from '../../components/ui';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Clock, UserCheck, Flag, CheckCircle } from 'lucide-react';
import { StatCard } from '../../components/admin/dashboard/StatCard';
import { QuickActionCard } from '../../components/admin/dashboard/QuickActionCard';
import { getDashboardStats } from '../../services/adminService';

export function AdminDashboardOverview() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        approvedAgencies: 0,
        pendingAgencies: 0,
        approvedGuides: 0,
        pendingGuides: 0,
        openReports: 0,
        resolvedReports: 0
    });
    const [loading, setLoading] = useState(true);



    const fetchStats = async () => {
        setLoading(true); setError('');
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setError('We could not load this page. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void fetchStats(); }, []);

    if (error) return <PageState kind="error" title="Unable to load platform overview" description={error} action={<Button onClick={() => void fetchStats()}>Try again</Button>} />;
    if (loading) {
        return (
            <PageState kind="loading" title="Loading platform overview" />
        );
    }

    // Platform statistics data
    const statsData = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            iconColor: 'text-brand',
            iconBgColor: 'bg-brand-soft'
        },
        {
            label: 'Approved Agencies',
            value: stats.approvedAgencies,
            icon: Building2,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100'
        },
        {
            label: 'Pending Agencies',
            value: stats.pendingAgencies,
            icon: Clock,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100'
        },
        {
            label: 'Approved Guides',
            value: stats.approvedGuides,
            icon: UserCheck,
            iconColor: 'text-teal-600',
            iconBgColor: 'bg-teal-100'
        },
        {
            label: 'Pending Guides',
            value: stats.pendingGuides,
            icon: Clock,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100'
        },
        {
            label: 'Total Approved',
            value: stats.approvedAgencies + stats.approvedGuides,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100'
        },
        {
            label: 'Open Reports',
            value: stats.openReports,
            icon: Flag,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100'
        },
        {
            label: 'Resolved Reports',
            value: stats.resolvedReports,
            icon: CheckCircle,
            iconColor: 'text-brand',
            iconBgColor: 'bg-brand-soft'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <PageHeader title="Platform overview" description="An overview of your community, providers, and moderation queue." />
            {location.state?.message && <Notice tone="success">{location.state.message}</Notice>}

            {/* Statistics Section */}
            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4 xl:gap-4">
                {statsData.map((stat, index) => (
                    <StatCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        iconBgColor={stat.iconBgColor}
                    />
                ))}
            </div>

            {/* Quick Actions Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickActionCard
                        label="Review pending verifications"
                        value={stats.pendingAgencies + stats.pendingGuides}
                        icon={Clock}
                        iconColor="text-orange-600"
                        iconBgColor="bg-orange-100"
                        onClick={() => navigate('/admin/verifications')}
                    />
                    <QuickActionCard
                        label="Open Reports"
                        value={stats.openReports}
                        icon={Flag}
                        iconColor="text-red-600"
                        iconBgColor="bg-red-100"
                        onClick={() => navigate('/admin/reports')}
                    />
                </div>
            </div>
        </div>
    );
}
