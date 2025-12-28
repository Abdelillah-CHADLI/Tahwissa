import { CheckCircle, Calendar, Mail, Home } from "lucide-react";

interface BookingSuccessPageProps {
    onNavigate: (page: string) => void;
    tourTitle?: string;
    email?: string;
    bookingRef?: string;
}

export function BookingSuccessPage({ onNavigate, tourTitle, email, bookingRef }: BookingSuccessPageProps) {
    const currentDate = new Date().toLocaleDateString();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                {/* Success Message */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Booking Confirmed!
                    </h1>
                    <p className="text-gray-600">
                        Thank you for your booking. We've sent a confirmation email to your inbox with all the details.
                    </p>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    {bookingRef ? (
                        <>
                            <h3 className="text-xl font-semibold text-center mb-4">
                                Booking Reference
                            </h3>
                            <div className="text-center mb-6">
                                <span className="text-3xl font-mono font-bold text-blue-600">
                                    {bookingRef}
                                </span>
                                <p className="text-sm text-gray-500 mt-1">
                                    Keep this reference number for your records
                                </p>
                            </div>
                        </>
                    ) : null}

                    <div className="space-y-3 text-sm">
                        {tourTitle ? (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-500">Tour:</span>
                                <span className="ml-auto font-medium">{tourTitle}</span>
                            </div>
                        ) : null}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">Booking Date:</span>
                            <span className="ml-auto font-medium">{currentDate}</span>
                        </div>
                        {email ? (
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-500">Confirmation Sent To:</span>
                                <span className="ml-auto font-medium">{email}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-3">What's Next?</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Check your email for booking confirmation and tour details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>The tour provider will contact you 24 hours before the tour date</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>You can view and manage your booking in "My Requests"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Free cancellation available up to 24 hours before tour date</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => onNavigate("requests")}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-4 h-4" />
                        View My Bookings
                    </button>
                    <button
                        onClick={() => onNavigate("explore")}
                        className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Explore More Tours
                    </button>
                </div>
            </div>
        </div>
    );
}