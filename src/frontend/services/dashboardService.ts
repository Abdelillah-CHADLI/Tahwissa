import type { DashboardData } from '../types/dashboard';
import { bookingService, tourService, profileService } from './api';
import { getCurrentAgencyUuid, getCurrentProfileType } from '../utils/session';

interface Traveller {
  traveller_fn?: string;
  traveller_ls?: string;
}

interface Tour {
  rating?: number;
  tour_id?: string | number;
  id?: string | number;
  tour_title?: string;
  title?: string;
  price?: number;
  views?: number;
  start_date?: string;
}

interface Booking {
  booking_id?: string | number;
  id?: string | number;
  tour_id?: string | number;
  booking_date?: string;
  status?: string;
  tour?: string;
  travellers?: Traveller;
  tours?: Tour;
}

interface AgencyProfile {
  rating?: number;
  ratings?: number;
  num_raters?: number;
}

interface TourWithBookings extends Tour {
  bookingCount: number;
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const agencyId = getCurrentAgencyUuid();
    const profileType = getCurrentProfileType();

    if (!agencyId || !profileType) {
      return {
        stats: {
          activeTours: 0,
          totalBookings: 0,
          averageRating: 0,
          monthlyBookingChange: 0,
          totalReviews: 0,
        },
        recentBookings: [],
        popularTours: [],
      };
    }

    // Failed requests must reach the page's error state instead of showing
    // fabricated zero counts as if the provider has no activity.
    const filterKey = profileType === 'agency' ? 'agencyId' : 'guideId';
    const [profileResponse, bookingsResponse, tourResponse] = await Promise.all([
      profileService.getProfile(agencyId, profileType),
      bookingService.getBookings({ [filterKey]: agencyId }),
      tourService.getAgencyTours(agencyId, profileType),
    ]);
    const agencyProfile: AgencyProfile | null = profileResponse?.data || profileResponse?.profile || null;
    const bookings: Booking[] = Array.isArray(bookingsResponse?.data) ? bookingsResponse.data : Array.isArray(bookingsResponse) ? bookingsResponse : [];
    const tours: Tour[] = tourResponse;

    // Calculate stats
    const totalBookings = bookings.length;

    // Calculate average rating from agency profile
    let averageRating = 0;
    let totalReviews = 0;
    if (agencyProfile) {
      const rating = Number(agencyProfile.rating ?? agencyProfile.ratings) || 0;
      const numRaters = Number(agencyProfile.num_raters) || 0;
      averageRating = numRaters > 0 ? rating / numRaters : 0;
      totalReviews = numRaters;
    }

    // Get recent bookings (last 5)
    const recentBookings = bookings.slice(0, 5).map((booking) => {
      const traveller = booking.travellers || {};
      const tour = booking.tours || {};
      const travelerName = traveller.traveller_fn && traveller.traveller_ls
        ? `${traveller.traveller_fn} ${traveller.traveller_ls}`
        : 'Unknown';

      return {
        id: String(booking.booking_id || booking.id || ''),
        tour: String(tour.tour_title || booking.tour || 'Unknown Tour'),
        traveler: travelerName,
        date: String(booking.booking_date || 'N/A'),
        status: (String(booking.status).toLowerCase() as 'confirmed' | 'pending' | 'cancelled') || 'pending',
        amount: `${tour.price || 0} DZD`,
      };
    });

    // Get popular tours - sort by number of bookings associated
    const tourBookingCount: Record<string, number> = {};
    bookings.forEach((booking) => {
      const tourId = String(booking.tour_id || booking.tours?.tour_id || '');
      if (tourId) {
        tourBookingCount[tourId] = (tourBookingCount[tourId] || 0) + 1;
      }
    });

    // Sort tours by booking count and get top 3
    const toursWithBookings: TourWithBookings[] = tours.map((tour) => ({
      ...tour,
      bookingCount: tourBookingCount[String(tour.tour_id)] || 0
    }));
    toursWithBookings.sort((a, b) => b.bookingCount - a.bookingCount);

    const popularTours = toursWithBookings.slice(0, 3).map((tour) => ({
      id: String(tour.tour_id || tour.id || ''),
      name: String(tour.tour_title || tour.title || 'Unknown Tour'),
      bookings: tour.bookingCount,
      views: Number(tour.views || 0),
      rating: Number(tour.rating || 0),
    }));

    // Count active tours (tours with start_date in the future)
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const activeTours = tours.filter((tour) => {
      const startDate = tour.start_date ? new Date(tour.start_date) : null;
      return startDate && startDate >= now;
    }).length;

    return {
      stats: {
        activeTours,
        totalBookings,
        averageRating: parseFloat(averageRating.toFixed(2)),
        monthlyBookingChange: 0,
        totalReviews,
      },
      recentBookings,
      popularTours,
    };
  }
};
