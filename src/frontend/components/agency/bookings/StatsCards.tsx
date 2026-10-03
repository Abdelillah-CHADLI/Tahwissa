
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
        <div className="mb-7 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4 xl:gap-4">
            {stats.map((stat) => (
                <div key={stat.title} className="panel p-4">
                    <div className="relative">
                        <div className="pr-5">
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <h3 className="break-words text-xl font-semibold tracking-tight text-brand-ink">{stat.value}</h3>
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
