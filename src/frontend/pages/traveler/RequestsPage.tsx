import { useState, useEffect } from "react";
import RequestCard from "../../components/traveler/requests/RequestCard";
import StatsCards from "../../components/traveler/requests/StatsCards";
import TabsNavigation from "../../components/traveler/requests/TabsNavigation";
import EmptyState from "../../components/traveler/requests/EmptyState";
import PageHeader from "../../components/traveler/requests/PageHeader";
import { profileService, bookingService } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';
import tourImage1 from '../../assets/imgs/tour1.jpeg';
import tourImage2 from '../../assets/imgs/tour2.jpeg';
import tourImage3 from '../../assets/imgs/tour3.jpeg';

interface BackendBooking {
  booking_id: string;
  traveller_id: string;
  tour_id: string;
  booking_date: string;
  status: string;
  tours?: {
    tour_id: string;
    tour_title?: string;
    price?: number;
    location?: string;
    group_size?: number;
    duration?: string;
    start_date?: string;
    agency_id?: string | null;
    guide_id?: string | null;
  };
}

interface Request {
  id: string;
  type: string;
  providerName: string;
  tourName: string;
  requestDate: string;
  preferredDate: string;
  status: "pending" | "confirmed" | "declined";
  travelers: number;
  price: number;
  duration: string;
  location: string;
  message: string;
  contactEmail: string;
  contactPhone: string;
  confirmedDetails?: string;
  declineReason?: string;
  image: string;
  tourId: string;
  bookingDate: string;
  startDate?: string;
}

function RequestsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getCurrentTravellerId = (): string | null => {
    const id = user?.id || (user as any)?.userId || (user as any)?.profileId;
    if (id) return String(id);

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const parsed = JSON.parse(userStr) as Record<string, unknown>;
      const travellerId =
        (parsed.traveller_id as string | undefined) ||
        (parsed.userId as string | undefined) ||
        (parsed.profileId as string | undefined) ||
        (parsed.id as string | undefined);
      return travellerId ? String(travellerId) : null;
    } catch {
      return null;
    }
  };

  const currentTravellerId = getCurrentTravellerId();

  // --- API Calls ---
  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentTravellerId) {
        setRequests([]);
        setError('Please sign in to view your requests.');
        return;
      }

      const response = await bookingService.getUserBookings(currentTravellerId);

      if (response.success && response.data) {
        const transformedRequests = await Promise.all(
          response.data.map(async (booking: BackendBooking) => {
            const tour = booking.tours;
            const providerDetails = await getProviderDetails(tour);
            const status = mapStatus(booking.status);

            return {
              id: booking.booking_id,
              type: tour?.agency_id ? "agency" : "guide",
              providerName: providerDetails?.name || "Unknown Provider",
              contactEmail: providerDetails?.email || "No email",
              contactPhone: providerDetails?.phone || "No phone",
              tourName: tour?.tour_title || "Unknown Tour",
              requestDate: formatDate(booking.booking_date),
              preferredDate: tour?.start_date ? formatDate(tour.start_date) : "Flexible",
              status: status,
              travelers: 1,
              location: tour?.location || "Unknown Location",
              message: `Booking for ${tour?.tour_title || "tour"}`,
              price: tour?.price || 0,
              image: getTourImage(tour),
              duration: tour?.duration || "Not specified",
              tourId: booking.tour_id,
              bookingDate: booking.booking_date,
              startDate: tour?.start_date,
              confirmedDetails: status === "confirmed" ? "Your booking has been confirmed!" : undefined,
              declineReason: status === "declined" ? "Booking was cancelled" : undefined,
            };
          })
        );

        setRequests(transformedRequests);
      } else {
        setError(response.error || "Failed to load bookings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    fetchUserBookings();
  }, []);

  // --- Data Processing ---
  const getProviderDetails = async (tour?: BackendBooking['tours']): Promise<any> => {
    if (!tour) return null;

    try {
      // Handle agency tours
      if (tour.agency_id) {
        const response = await profileService.getProfile(tour.agency_id, 'agency');

        if (response?.success && response?.data) {
          return {
            name: response.data.agency_name || "Agency Provider",
            email: response.data.support_email || "No email",
            phone: response.data.phone_number || "No phone",
          };
        }

      }

      // Handle guide tours
      if (tour.guide_id) {
        const response = await profileService.getProfile(tour.guide_id, 'guide');

        if (response?.success && response?.data) {
          return {
            name: response.data.guide_name || "Guide Provider",
            email: response.data.support_email || "No email",
            phone: response.data.phone_number || "No phone",
          };
        }

      }

      return null;

    } catch (error) {
      console.error('Error fetching provider details:', error);
      return null;
    }
  };



  const mapStatus = (backendStatus: string): "pending" | "confirmed" | "declined" => {
    const statusMap: Record<string, "pending" | "confirmed" | "declined"> = {
      "PENDING": "pending",
      "CONFIRMED": "confirmed",
      "DECLINED": "declined",
      "CANCELLED": "declined"
    };
    return statusMap[backendStatus] || "pending";
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    } catch {
      return dateString;
    }
  };

  const getTourImage = (tour?: BackendBooking['tours']): string => {
    const location = tour?.location?.toLowerCase() || '';
    if (location.includes('sahara') || location.includes('tamanrasset') || location.includes('djanet')) return tourImage1;
    if (location.includes('coast') || location.includes('oran') || location.includes('annaba')) return tourImage2;
    return tourImage3;
  };

  // --- Filter Logic ---
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const confirmedRequests = requests.filter((r) => r.status === "confirmed");
  const declinedRequests = requests.filter((r) => r.status === "declined");

  const tabs = [
    { id: "all", label: `All (${requests.length})` },
    { id: "pending", label: `Pending (${pendingRequests.length})` },
    { id: "confirmed", label: `Confirmed (${confirmedRequests.length})` },
    { id: "declined", label: `Declined (${declinedRequests.length})` },
  ];

  const getRequestsToShow = (): Request[] => {
    switch (activeTab) {
      case "pending": return pendingRequests;
      case "confirmed": return confirmedRequests;
      case "declined": return declinedRequests;
      default: return requests;
    }
  };



  const requestsToShow = getRequestsToShow();

  // --- Loading State ---
  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6">
        <PageHeader
          title="My Requests"
          description="Track all your tour and guide requests"
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="ml-4 text-lg">Loading your requests...</div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6">
        <PageHeader
          title="My Requests"
          description="Track all your tour and guide requests"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl">
          <div className="text-red-800 font-semibold text-lg">Error loading requests</div>
          <div className="text-red-600 mt-2">{error}</div>
          <button
            onClick={fetchUserBookings}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6">
      <PageHeader
        title="My Requests"
        description="Track all your tour and guide requests"
      />

      <StatsCards
        pendingCount={pendingRequests.length}
        confirmedCount={confirmedRequests.length}
        declinedCount={declinedRequests.length}
      />

      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="space-y-4">
        {requestsToShow.length > 0 ? (
          requestsToShow.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
            />
          ))
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </div>
    </div>
  );
}

export default RequestsPage;
