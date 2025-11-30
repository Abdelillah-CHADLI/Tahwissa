import { Star, ThumbsUp, MessageSquare } from "lucide-react";

type Review = {
    id: string;
    customerName: string;
    customerAvatar: string;
    rating: number;
    date: string;
    tourName: string;
    comment: string;
    helpful: number;
    hasReply?: boolean;
    reply?: {
        text: string;
        date: string;
    }
}

type ReviewCardProps = {
    review: Review;
    onHelpful?: (reviewId: string) => void;
    onReply?: (reviewId: string) => void;
}

const renderStars = (rating: number) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                />
            ))}
        </div>
    );
};

export function ReviewCard({ review, onHelpful, onReply }: ReviewCardProps) {
    return (
        <div className="border-2 hover:border-primary/50 transition-all rounded-lg p-6">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                    {review.customerName.split(" ").map((n) => n[0]).join("")}
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h4 className="mb-1">{review.customerName}</h4>
                            <p className="text-sm text-muted-foreground">
                                {review.tourName}
                            </p>
                        </div>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                            {review.date}
                        </span>
                    </div>

                    <div className="mb-3">{renderStars(review.rating)}</div>

                    <p className="text-muted-foreground mb-4">
                        {review.comment}
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => onHelpful?.(review.id)}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({review.helpful})
                        </button>
                        <button
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => onReply?.(review.id)}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}