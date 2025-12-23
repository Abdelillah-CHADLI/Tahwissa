interface StatCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBgColor: string;
}

export function StatCard({ label, value, icon: Icon, iconColor, iconBgColor }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-600 text-sm mb-2">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
                </div>
                <div className={`${iconBgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
