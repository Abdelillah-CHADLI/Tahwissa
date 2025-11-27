import { Star, TrendingUp } from "lucide-react";

type TourRating = {
    name: string;
    rating: number;
    reviews: number;
    trend: string;
}

type TourPerformanceProps = {
    tourRatings: TourRating[];
}

const renderStars = (rating: number) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                />
            ))}
        </div>
    );
};

export function TourPerformance({ tourRatings }: TourPerformanceProps) {
    return (
        <div className="border rounded-lg">
            <div className="p-6 border-b">
                <h3 className="font-semibold">Tour Performance</h3>
            </div>
            <div className="p-6 space-y-4">
                {tourRatings.map((tour) => (
                    <div
                        key={tour.name}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50"
                    >
                        <div className="flex-1">
                            <h4 className="mb-2">{tour.name}</h4>
                            <div className="flex items-center gap-4">
                                {renderStars(Math.round(tour.rating))}
                                <span className="text-sm text-muted-foreground">
                                    {tour.rating} ({tour.reviews} reviews)
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-500">
                                {tour.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}