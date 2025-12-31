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
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

            <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
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

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-medium text-sm text-gray-900">Free Cancellation</p>
                        <p className="text-xs text-gray-600">
                            Cancel up to 24 hours before for a full refund
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}