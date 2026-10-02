import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, Star } from "lucide-react";
import PageHeader from "../../components/traveler/requests/PageHeader";
import { ReviewCard } from "../../components/agency/reviews/ReviewCard";
import { reviewService, tourService } from "../../services/api";
import { getCurrentAgencyUuid } from "../../utils/session";
import { getContextText } from "../../utils/userContext";

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

            const agencyTours = await tourService.getAgencyTours(agencyId);

            if (agencyTours.length === 0) {
                setReviews([]);
                setStats({
                    averageRating: 0,
                    totalReviews: 0,
                    ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                });
                setLoading(false);
                setError(getContextText('No tours found for your agency.', 'No tours found for your profile.'));
                return;
            }

            const allReviews: Review[] = [];
            let totalRatingSum = 0;
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
                    // Continue to next tour if one fails
                }
            }

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

            if (allReviews.length === 0) {
                setError(`No reviews found for your ${agencyTours.length} tours. Your tours exist but haven't received any reviews yet.`);
            }

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

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Feedback & Reviews"
                    description="Manage customer feedback and tour ratings"
                />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-lg text-gray-600">Loading reviews...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Feedback & Reviews"
                description="Manage customer feedback and tour ratings"
            />

            {error && reviews.length > 0 ? (
                <div className="bg-yellow-50 border-yellow-200 border rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-yellow-800 font-semibold">
                            Notice
                        </div>
                        <div className="text-yellow-700 mt-1">{error}</div>
                    </div>
                    <button
                        onClick={fetchReviews}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : reviews.length === 0 && !error ? (
                <div className="bg-gray-50 border-gray-200 border rounded-lg p-4 text-center">
                    <div className="text-gray-600">No reviews yet for this tour.</div>
                    <div className="text-gray-500 text-sm mt-1">Be the first to leave a review!</div>
                </div>
            ) : null}

            {reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Overall Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-4">
                                <div className="text-5xl font-bold text-blue-600">
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
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg font-medium mb-2">
                            No Reviews Yet
                        </p>
                        <p className="text-gray-500 text-sm">
                            Keep providing excellent service to receive reviews from travelers!
                        </p>
                    </div>
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
