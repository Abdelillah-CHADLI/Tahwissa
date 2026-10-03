import { MapPin, Clock, CheckCircle } from "lucide-react";


interface Tour {
    id: number;
    title: string;
    location: string;
    duration: string;
    price: number;
    image: string;
}


export function BookingSummary(tour: Tour) {
    return (
        <aside className="panel panel-body h-fit md:sticky md:top-4">
            <h2 className="mb-4 text-lg font-semibold text-brand-ink">Tour summary</h2>

            <img
                src={tour.image}
                alt={tour.title}
                className="mb-4 h-40 w-full rounded-lg object-cover"
            />

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
            <div className="space-y-1 text-gray-600 text-sm mb-4">
                <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {tour.location}
                </p>
                <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {tour.duration}
                </p>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per person</span>
                    <span>{tour.price.toLocaleString()} DZD</span>
                </div>
            </div>

            <div className="mt-4 rounded-lg bg-brand-soft p-3">
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-medium text-sm text-gray-900">Request first</p>
                        <p className="text-xs text-gray-600">
                            The provider confirms availability. No payment is collected on this site.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
