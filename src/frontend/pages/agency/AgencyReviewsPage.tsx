import { Button, PageState } from '../../components/ui';
import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import PageHeader from "../../components/traveler/requests/PageHeader";
import { ReviewCard } from "../../components/agency/reviews/ReviewCard";
import { reviewService, tourService } from "../../services/api";
import { getCurrentAgencyUuid, getCurrentProfileType } from "../../utils/session";

interface Review {
    id: string;
    customerName: string;
    customerAvatar: string;
    rating: number;
    date: string;
    tourName: string;
    comment: string;
    helpful: number;
}

export function AgencyReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });

    const getAgencyId = () => getCurrentAgencyUuid();

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const agencyId = getAgencyId();
            if (!agencyId) {
                setReviews([]);
                setStats({
                    averageRating: 0,
                    totalReviews: 0,
                    ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                });
                setError("Agency ID not found. Please log in.");
                setLoading(false);
                return;
            }

            const agencyTours = await tourService.getAgencyTours(agencyId, getCurrentProfileType() || 'agency');

            if (agencyTours.length === 0) {
                setReviews([]);
                setStats({
                    averageRating: 0,
                    totalReviews: 0,
                    ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                });
                setLoading(false);
                return;
            }

            const allReviews: Review[] = [];
            let totalRatingSum = 0;
            let failedTours = 0;
            const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

            for (const tour of agencyTours) {
                try {
                    const tourId = tour.tour_id;
                    const reviewsResponse = await reviewService.getReviewsByTour(tourId);

                    if (reviewsResponse && reviewsResponse.success && Array.isArray(reviewsResponse.data)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        reviewsResponse.data.forEach((review: any) => {
                            const transformedReview: Review = {
                                id: review.review_id,
                                customerName: review.travellers
                                    ? `${review.travellers.traveller_fn || ''} ${review.travellers.traveller_ls || ''}`.trim()
                                    : "Anonymous Traveler",
                                customerAvatar: "",
                                rating: review.review_score || 0,
                                date: review.created_at,
                                tourName: tour.tour_title,
                                comment: review.comment || "",
                                helpful: review.helpful_count || 0,
                            };

                            allReviews.push(transformedReview);

                            const score = transformedReview.rating;
                            totalRatingSum += score;

                            const roundedScore = Math.round(score);
                            if (roundedScore >= 1 && roundedScore <= 5) {
                                ratingDistribution[roundedScore as keyof typeof ratingDistribution]++;
                            }
                        });
                    }
                } catch {
                    failedTours++;
                }
            }

            if (failedTours) setError('Some reviews could not be loaded. Try again to see the complete list.');
            allReviews.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setReviews(allReviews);

            const averageRating = allReviews.length > 0
                ? parseFloat((totalRatingSum / allReviews.length).toFixed(1))
                : 0;

            setStats({
                averageRating: averageRating,
                totalReviews: allReviews.length,
                ratings: ratingDistribution
            });



        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load reviews";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) return <PageState kind="loading" title="Loading traveler feedback" />;
    return (
        <div className="space-y-6">
            <PageHeader title="Feedback & reviews" description="See what travelers enjoyed and where you can improve their experience." />
            {error && <PageState kind="error" title="Some feedback is unavailable" description={error} action={<Button onClick={() => void fetchReviews()}>Try again</Button>} />}
            {reviews.length > 0 && (
                <div className="panel panel-body">
                    <h3 className="text-lg font-semibold mb-4">Overall Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold text-brand">
                                    {stats.averageRating.toFixed(1)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= Math.round(stats.averageRating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Based on {stats.totalReviews} reviews
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = stats.ratings[rating as keyof typeof stats.ratings];
                                const percentage = stats.totalReviews > 0
                                    ? (count / stats.totalReviews) * 100
                                    : 0;

                                return (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="text-sm w-12">{rating} star</span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                        {reviews.length > 0 ? `Recent Reviews (${reviews.length})` : 'Reviews'}
                    </h3>
                </div>

                {reviews.length === 0 ? (
                    <PageState title="No reviews yet" description="Feedback from travelers will appear here after they review your tours." />
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={{
                                    ...review,
                                    date: formatDate(review.date)
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
