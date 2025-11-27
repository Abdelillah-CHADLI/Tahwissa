
type StatCard = {
    title: string;
    value: string;
    icon: any;
    color: string;
}

type StatsCardsProps = {
    stats: StatCard[];
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                <div key={stat.title} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <h3 className="text-xl font-bold">{stat.value}</h3>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}