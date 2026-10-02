import { CheckCircle, Calendar, Home } from "lucide-react";

interface BookingSuccessPageProps {
    onNavigate: (page: string) => void;
    tourTitle?: string;
    bookingRef?: string;
}

export function BookingSuccessPage({ onNavigate, tourTitle, bookingRef }: BookingSuccessPageProps) {
    const currentDate = new Date().toLocaleDateString();

    return (
        <div className="min-h-[70vh] bg-[#f5f8f7] flex items-center justify-center p-4">
            <div className="panel max-w-xl w-full p-5 sm:p-7">
                {/* Success Icon */}
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                </div>

                {/* Success Message */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Booking request sent
                    </h1>
                    <p className="text-gray-600">
                        Your request is pending. You can track its status in My Requests.
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
                                <span className="text-2xl font-mono break-all font-bold text-teal-700">
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
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-teal-50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-3">What's Next?</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Check My Requests for the provider's decision</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Contact the provider if you need to discuss tour details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>You can view and manage your request in My Requests</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>You can cancel a pending request from your account</span>
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
                        View my requests
                    </button>
                    <button
                        onClick={() => onNavigate("explore")}
                        className="flex-1 py-3 px-4 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Explore More Tours
                    </button>
                </div>
            </div>
        </div>
    );
}
