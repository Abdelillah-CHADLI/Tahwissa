import { XCircle, Users, Mail, Phone, MapPin, Calendar, CheckCircle } from "lucide-react";

type Booking = {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    tour: string;
    date: string;
    people: number;
    totalPrice: number;
    status: "confirmed" | "pending" | "cancelled";
    bookedOn: string;
}

type BookingDetailsModalProps = {
    booking: Booking;
    onClose: () => void;
    onConfirmBooking?: (bookingId: string) => void;
    onCancelBooking?: (bookingId: string) => void;
}

const getStatus = (status: string) => {
    if (status === "confirmed") {
        return (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Confirmed
            </span>
        );
    }
    if (status === "pending") {
        return (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Pending
            </span>
        );
    }
    if (status === "cancelled") {
        return (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Cancelled
            </span>
        );
    }
    return null;
};

export function BookingDetails({
    booking,
    onClose,
    onConfirmBooking,
    onCancelBooking
}: BookingDetailsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[100vh] overflow-auto">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Booking Details</h2>
                            <p className="text-gray-600 mt-1">ID: {booking.id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Customer Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span>{booking.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{booking.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tour Information */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">Tour Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{booking.tour}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>Tour Date: {booking.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span>{booking.people} people</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="font-semibold">
                                    {booking.totalPrice.toLocaleString()} DZD
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status</span>
                                {getStatus(booking.status)}
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Booked On</span>
                                <span>{booking.bookedOn}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons for Pending Bookings */}
                    {booking.status === "pending" && (
                        <div className="border-t pt-4 flex gap-3">
                            <button
                                className="flex-1 bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700"
                                onClick={() => onConfirmBooking?.(booking.id)}
                            >
                                <CheckCircle className="w-4 h-4" />
                                Confirm Booking
                            </button>
                            <button
                                className="flex-1 border border-red-600 text-red-600 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-50"
                                onClick={() => onCancelBooking?.(booking.id)}
                            >
                                <XCircle className="w-4 h-4" />
                                Cancel Booking
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}