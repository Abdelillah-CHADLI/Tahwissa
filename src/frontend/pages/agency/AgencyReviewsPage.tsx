import { useState } from "react";
import PageHeader from "../../components/traveler/requests/PageHeader";
import { ReviewCard } from "../../components/agency/reviews/ReviewCard";
import { TourPerformance } from "../../components/agency/reviews/TourPerformance";
import { SortSelect } from "../../components/agency/reviews/SortSelect";
import { OverallStats } from "../../components/agency/reviews/OverallStats";
import { reviews } from "../../data/reviews";

const overallStats = {
    averageRating: 4.8,
    totalReviews: 89,
    ratings: {
        5: 65,
        4: 18,
        3: 4,
        2: 1,
        1: 1,
    },
};

const tourRatings = [
    {
        name: "Sahara Desert Adventure",
        rating: 4.9,
        reviews: 45,
        trend: "+0.2",
    },
    {
        name: "Mediterranean Coastal Tour",
        rating: 4.8,
        reviews: 38,
        trend: "+0.1",
    },
    {
        name: "Atlas Mountains Trek",
        rating: 4.7,
        reviews: 32,
        trend: "0",
    },
];

export function AgencyReviewsPage() {
    const [sortBy, setSortBy] = useState("recent");

    const handleHelpful = (reviewId: string) => {
        console.log("Marked as helpful:", reviewId);
    };

    const handleReply = (reviewId: string) => {
        console.log("Reply to review:", reviewId);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Feedback & Reviews"
                description="Manage customer feedback and tour ratings"
            />

            <OverallStats overallStats={overallStats} />

            <TourPerformance tourRatings={tourRatings} />

            {/* Reviews List */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3>Recent Reviews</h3>
                    <SortSelect
                        value={sortBy}
                        onChange={setSortBy}
                    />
                </div>

                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onHelpful={handleHelpful}
                            onReply={handleReply}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}