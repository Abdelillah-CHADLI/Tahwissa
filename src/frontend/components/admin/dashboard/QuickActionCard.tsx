interface QuickActionCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBgColor: string;
}

export function QuickActionCard({ label, value, icon: Icon, iconColor, iconBgColor }: QuickActionCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`${iconBgColor} p-3 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                    <p className="text-gray-600 text-sm mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
