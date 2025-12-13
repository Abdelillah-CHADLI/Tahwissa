import { Users, Building2, Clock, UserCheck, Flag, CheckCircle } from 'lucide-react';
import { StatCard } from '../../components/admin/dashboard/StatCard';
import { QuickActionCard } from '../../components/admin/dashboard/QuickActionCard';

export function AdminDashboardOverview() {
    // Platform statistics data
    const stats = [
        {
            label: 'Total Users',
            value: 2847,
            icon: Users,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100'
        },
        {
            label: 'Approved Agencies',
            value: 156,
            icon: Building2,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100'
        },
        {
            label: 'Pending Agencies',
            value: 23,
            icon: Clock,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100'
        },
        {
            label: 'Approved Guides',
            value: 342,
            icon: UserCheck,
            iconColor: 'text-teal-600',
            iconBgColor: 'bg-teal-100'
        },
        {
            label: 'Pending Guides',
            value: 47,
            icon: Clock,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100'
        },
        {
            label: 'Total Approved',
            value: 498,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100'
        },
        {
            label: 'Open Reports',
            value: 12,
            icon: Flag,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100'
        },
        {
            label: 'Resolved Reports',
            value: 284,
            icon: CheckCircle,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100'
        }
    ];

    // Quick actions data
    const quickActions = [
        {
            label: 'Pending',
            value: 70,
            icon: Clock,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100'
        },
        {
            label: 'Open Reports',
            value: 12,
            icon: Flag,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100'
        }
    ];

    return (
        <div className="p-6 space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Overview</h1>
                <p className="text-gray-600">Current statistics and platform status</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
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
                    {quickActions.map((action, index) => (
                        <QuickActionCard
                            key={index}
                            label={action.label}
                            value={action.value}
                            icon={action.icon}
                            iconColor={action.iconColor}
                            iconBgColor={action.iconBgColor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
