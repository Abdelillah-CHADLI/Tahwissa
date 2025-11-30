import { Star } from "lucide-react";

type OverallStatsProps = {
    overallStats: {
        averageRating: number;
        totalReviews: number;
        ratings: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    };
}

export function OverallStats({ overallStats }: OverallStatsProps) {
    const getPercentage = (count: number) => {
        return (count / overallStats.totalReviews) * 100;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Average Rating Card */}
            <div className="border-2 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                    <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
                </div>
                <h2 className="mb-2">{overallStats.averageRating}</h2>
                <p className="text-muted-foreground mb-2">
                    Average Rating
                </p>
                <p className="text-sm text-muted-foreground">
                    Based on {overallStats.totalReviews} reviews
                </p>
            </div>

            {/* Rating Distribution */}
            <div className="border-2 rounded-lg p-6 lg:col-span-2">
                <h4 className="mb-4">Rating Distribution</h4>
                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-12">
                                <span className="text-sm">{rating}</span>
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{
                                        width: `${getPercentage(overallStats.ratings[rating as keyof typeof overallStats.ratings])}%`
                                    }}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                                {overallStats.ratings[rating as keyof typeof overallStats.ratings]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}