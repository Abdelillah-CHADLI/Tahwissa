import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Clock, UserCheck, Flag, CheckCircle } from 'lucide-react';
import { StatCard } from '../../components/admin/dashboard/StatCard';
import { QuickActionCard } from '../../components/admin/dashboard/QuickActionCard';
import { getDashboardStats } from '../../services/adminService';

export function AdminDashboardOverview() {
    const navigate = useNavigate();
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

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

    // Platform statistics data
    const statsData = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100'
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
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100'
        }
    ];

    return (
        <div className="p-6 space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Overview</h1>
                <p className="text-gray-600">Current statistics and platform status</p>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <QuickActionCard
                        label="Pending"
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
