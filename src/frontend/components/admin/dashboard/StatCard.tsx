interface StatCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBgColor: string;
}

export function StatCard({ label, value, icon: Icon, iconColor }: StatCardProps) {
    return (
        <div className="panel p-4 sm:p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-600 text-sm mb-2">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
                </div>
                <div className={'pt-1'}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
