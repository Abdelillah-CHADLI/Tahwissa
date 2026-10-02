import { Star } from "lucide-react";

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

type ReviewCardProps = { review: Review; }

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

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="rounded-2xl border border-[#dce9e5] bg-white p-4 transition-shadow hover:shadow-sm sm:p-5">
            <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#348086] font-medium text-white">
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
                        <span className="rounded bg-[#edf5ef] px-2 py-1 text-xs text-[#28676d]">
                            {review.date}
                        </span>
                    </div>

                    <div className="mb-3">{renderStars(review.rating)}</div>

                    <p className="text-sm leading-relaxed text-slate-600">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    );
}
