import { useState, useEffect, useCallback } from "react";
import { Calendar, Users, DollarSign, MapPin, Loader2, AlertCircle } from "lucide-react";
import { BookingCard } from "../../components/agency/bookings/BookingCard";
import { StatsCards } from "../../components/agency/bookings/StatsCards";
import { TabsNavigation } from "../../components/agency/bookings/TabsNavigation";
import { EmptyState } from "../../components/agency/bookings/EmptyState";
import { BookingDetails } from "../../components/agency/bookings/BookingDetails";
import { bookingService, advancedBookingService } from "../../services/api";

interface Booking {
    id: string;
    customerName: string;
    tour: string;
    date: string;
    people: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled";
    email: string;
    phone: string;
    location: string;
    duration: string;
    tourType: string;
    bookedOn: string;
}

export function AgencyBookingPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getAgencyId = () => {
        return localStorage.getItem('agencyId') || "550e8400-e29b-41d4-a716-446655440101";
    };

    const fetchAgencyBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const agencyId = getAgencyId();
            const response = await bookingService.getBookings({ agencyId });
            const bookingsData = response.success && response.data ? response.data : response;

            if (Array.isArray(bookingsData)) {
                const transformedBookings: Booking[] = bookingsData.map((booking: any) => ({
                    id: booking.booking_id,
                    customerName: booking.travellers
                        ? `${booking.travellers.traveller_fn} ${booking.travellers.traveller_ls}`
                        : "Unknown Customer",
                    tour: booking.tours?.tour_title || "Unknown Tour",
                    date: booking.tours?.start_date || "Unknown Date",
                    people: booking.number_of_people || 1,
                    totalPrice: booking.total_amount || booking.tours?.price || 0,
                    status: mapStatus(booking.status),
                    email: booking.travellers?.email || "No email",
                    phone: booking.travellers?.phone || "No phone",
                    location: booking.tours?.location || "Unknown Location",
                    duration: booking.tours?.duration ? `${booking.tours.duration} days` : "N/A",
                    tourType: booking.tours?.category || "Standard",
                    bookedOn: booking.booking_date || new Date().toISOString().split('T')[0]
                }));

                setBookings(transformedBookings);
            } else {
                throw new Error("Invalid response format from server");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load bookings";
            setError(errorMessage);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleConfirmBooking = async (bookingId: string) => {
        try {
            setError(null);
            await advancedBookingService.confirmBooking(bookingId);
            await fetchAgencyBookings();
            setSelectedBooking(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to confirm booking";
            setError(errorMessage);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        const reason = prompt("Please provide a reason for cancellation (optional):");
        try {
            setError(null);
            await advancedBookingService.cancelBooking(bookingId, reason || undefined);
            await fetchAgencyBookings();
            setSelectedBooking(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to cancel booking";
            setError(errorMessage);
        }
    };

    useEffect(() => {
        fetchAgencyBookings();
    }, [fetchAgencyBookings]);

    const mapStatus = (backendStatus: string): "pending" | "confirmed" | "cancelled" => {
        const statusMap: Record<string, "pending" | "confirmed" | "cancelled"> = {
            "PENDING": "pending",
            "CONFIRMED": "confirmed",
            "CANCELLED": "cancelled",
            "DECLINED": "cancelled"
        };
        return statusMap[backendStatus] || "pending";
    };

    const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
    const pendingCount = bookings.filter((b) => b.status === "pending").length;
    const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;
    const totalRevenue = bookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

    const stats = [
        {
            title: "Total Bookings",
            value: bookings.length.toString(),
            icon: Calendar,
            color: "text-blue-600",
        },
        {
            title: "Total Revenue",
            value: `${totalRevenue.toLocaleString()} DZD`,
            icon: DollarSign,
            color: "text-green-600",
        },
        {
            title: "Active Tours",
            value: new Set(bookings.map(b => b.tour)).size.toString(),
            icon: MapPin,
            color: "text-purple-600",
        },
        {
            title: "Total Travelers",
            value: bookings.reduce((sum, booking) => sum + booking.people, 0).toString(),
            icon: Users,
            color: "text-orange-600",
        },
    ];

    const tabs = [
        { id: "all", label: `All (${bookings.length})` },
        { id: "confirmed", label: `Confirmed (${confirmedCount})` },
        { id: "pending", label: `Pending (${pendingCount})` },
        { id: "cancelled", label: `Cancelled (${cancelledCount})` },
    ];

    const filteredBookings = bookings.filter((booking) => {
        if (activeTab === "all") return true;
        return booking.status === activeTab;
    });

    const handleViewDetails = (bookingId: string) => {
        setSelectedBooking(bookingId);
    };

    const handleCloseModal = () => {
        setSelectedBooking(null);
    };

    const selectedBookingData = selectedBooking
        ? bookings.find((b) => b.id === selectedBooking)
        : null;

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-lg text-gray-600">Loading bookings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-red-800 font-semibold">Error loading bookings</div>
                        <div className="text-red-600 mt-1">{error}</div>
                    </div>
                    <button
                        onClick={fetchAgencyBookings}
                        className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            <StatsCards stats={stats} />

            <TabsNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="border rounded-lg bg-white">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Bookings ({filteredBookings.length})</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium">Booking ID</th>
                                <th className="text-left p-3 text-sm font-medium">Customer</th>
                                <th className="text-left p-3 text-sm font-medium">Tour</th>
                                <th className="text-left p-3 text-sm font-medium">Date</th>
                                <th className="text-left p-3 text-sm font-medium">People</th>
                                <th className="text-left p-3 text-sm font-medium">Total</th>
                                <th className="text-left p-3 text-sm font-medium">Status</th>
                                <th className="text-left p-3 text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <EmptyState />
                            ) : (
                                filteredBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedBookingData && (
                <BookingDetails
                    booking={selectedBookingData}
                    onClose={handleCloseModal}
                    onConfirmBooking={handleConfirmBooking}
                    onCancelBooking={handleCancelBooking}
                />
            )}
        </div>
    );
}