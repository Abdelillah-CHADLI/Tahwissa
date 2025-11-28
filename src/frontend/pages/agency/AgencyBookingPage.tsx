import { useState } from "react";
import { Calendar, Users, DollarSign, MapPin } from "lucide-react";
import PageHeader from "../../components/requests/PageHeader";
import { BookingCard } from "../../components/agency/bookings/BookingCard";
import { StatsCards } from "../../components/agency/bookings/StatsCards";
import { TabsNavigation } from "../../components/agency/bookings/TabsNavigation";
import { EmptyState } from "../../components/agency/bookings/EmptyState";
import { BookingDetails } from "../../components/agency/bookings/BookingDetails";
import { bookings } from "../../data/bookings";


export function AgencyBookingPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

    // Filter bookings based on active tab
    const filteredBookings = bookings.filter((booking) => {
        if (activeTab === "all") return true;
        return booking.status === activeTab;
    });

    // Count bookings by status
    const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
    const pendingCount = bookings.filter((b) => b.status === "pending").length;
    const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

    // Stats data
    const stats = [
        {
            title: "Total Bookings",
            value: "24",
            icon: Calendar,
            color: "text-blue-600",
        },
        {
            title: "Total Revenue",
            value: "2,450,000 DZD",
            icon: DollarSign,
            color: "text-green-600",
        },
        {
            title: "Active Tours",
            value: "8",
            icon: MapPin,
            color: "text-purple-600",
        },
        {
            title: "Total Travelers",
            value: "56",
            icon: Users,
            color: "text-orange-600",
        },
    ];

    // Tabs data
    const tabs = [
        { id: "all", label: `All (${bookings.length})` },
        { id: "confirmed", label: `Confirmed (${confirmedCount})` },
        { id: "pending", label: `Pending (${pendingCount})` },
        { id: "cancelled", label: `Cancelled (${cancelledCount})` },
    ];

    // Event handlers
    const handleViewDetails = (bookingId: string) => {
        setSelectedBooking(bookingId);
    };

    const handleCloseModal = () => {
        setSelectedBooking(null);
    };

    const handleConfirmBooking = (bookingId: string) => {
        console.log("Confirm booking:", bookingId);
        // confirmation to be added here
        setSelectedBooking(null);
    };

    const handleCancelBooking = (bookingId: string) => {
        console.log("Cancel booking:", bookingId);
        // cancellation to be added here
        setSelectedBooking(null);
    };

    // Find selected booking for modal
    const selectedBookingData = selectedBooking
        ? bookings.find((b) => b.id === selectedBooking)
        : null;

    return (
        <div className="p-6">
            <PageHeader
                title="Booking Management"
                description="Manage your agency bookings and customer requests"
            />

            <StatsCards stats={stats} />

            <TabsNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Bookings Table */}
            <div className="border rounded-lg bg-white">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Bookings</h2>
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

            {/* Booking Details Modal */}
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