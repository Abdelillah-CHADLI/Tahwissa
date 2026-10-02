
type StatCard = {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

type StatsCardsProps = {
    stats: StatCard[];
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                <div key={stat.title} className="panel p-4">
                    <div className="relative">
                        <div className="pr-5">
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <h3 className="text-lg font-semibold break-words">{stat.value}</h3>
                        </div>
                        <div className={`absolute right-0 top-0.5 ${stat.color}`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
