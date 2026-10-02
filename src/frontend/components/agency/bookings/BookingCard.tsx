import { CheckCircle, XCircle, Clock, } from "lucide-react";

interface Booking {
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

interface BookingCardProps {
    booking: Booking;
    onViewDetails: (bookingId: string) => void;
}

const getStatusBadge = (status: string) => {
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
                <Clock className="w-3 h-3" />
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

export function BookingCard({ booking, onViewDetails }: BookingCardProps) {
    return (
        <tr className="border-t hover:bg-gray-50">
            <td data-label="Reference" className="p-3 font-medium">{booking.id}</td>
            <td data-label="Traveler" className="p-3">
                <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-gray-600">{booking.email}</p>
                </div>
            </td>
            <td data-label="Tour" className="p-3 max-w-xs">
                <p className="truncate">{booking.tour}</p>
            </td>
            <td data-label="Departure" className="p-3">{booking.date}</td>
            <td data-label="People" className="p-3">{booking.people}</td>
            <td data-label="Value" className="p-3">{booking.totalPrice.toLocaleString()} DZD</td>
            <td data-label="Status" className="p-3">{getStatusBadge(booking.status)}</td>
            <td data-label="Action" className="p-3">
                <button
                    className="border p-2 rounded hover:bg-gray-100"
                    onClick={() => onViewDetails(booking.id)}
                >
                    View Details
                </button>
            </td>
        </tr>
    );
}