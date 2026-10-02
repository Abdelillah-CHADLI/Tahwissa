interface QuickActionCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBgColor: string;
    onClick?: () => void;
}

export function QuickActionCard({ label, value, icon: Icon, iconColor, onClick }: QuickActionCardProps) {
    return (
        <button type="button"
            onClick={onClick}
            className="panel p-5 text-left hover:border-brand transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className={'text-brand'}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                    <p className="text-gray-600 text-sm mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </button>
    );
}
