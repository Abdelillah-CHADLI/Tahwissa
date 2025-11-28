import type { DashboardData } from '../types/dashboard';
import { bookingService, tourService, reviewService } from './api';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Get agency ID from localStorage
      const agencyId = localStorage.getItem('agencyId') || '1';
      
      // Fetch bookings for this agency
      const bookingsResponse = await bookingService.getBookings({ agencyId });
      const bookings = bookingsResponse.data || [];
      
      // Fetch tours
      const toursResponse = await tourService.getTours();
      const tours = toursResponse.data || [];
      
      // Calculate stats
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter((b: Record<string, unknown>) => b.status === 'confirmed').length;
      
      // Get recent bookings (last 3)
      const recentBookings = bookings.slice(0, 3).map((booking: Record<string, unknown>) => ({
        id: String(booking.booking_id || booking.id || ''),
        tour: String(booking.tour_name || booking.tour || 'Unknown Tour'),
        traveler: String(booking.traveller_name || booking.traveler || 'Unknown'),
        date: String(booking.booking_date || booking.date || 'N/A'),
        status: (booking.status as 'confirmed' | 'pending' | 'cancelled') || 'pending',
        amount: `${booking.total_price || 0} DZD`,
      }));
      
      // Get popular tours (top 3 by bookings or default to first 3)
      const popularTours = tours.slice(0, 3).map((tour: Record<string, unknown>) => ({
        name: String(tour.title || tour.name || 'Untitled Tour'),
        bookings: Number(tour.bookings || 0),
        views: Number(tour.views || 0),
        rating: Number(tour.rating || 4.5),
      }));
      
      // Calculate average rating from tours
      const totalRating = tours.reduce((sum: number, tour: Record<string, unknown>) => sum + Number(tour.rating || 0), 0);
      const averageRating = tours.length > 0 ? totalRating / tours.length : 0;
      
      return {
        stats: {
          activeTours: tours.filter((t: Record<string, unknown>) => t.status === 'Active' || t.status === 'active').length,
          totalBookings,
          averageRating: parseFloat(averageRating.toFixed(1)),
          monthlyBookingChange: 18, // TODO: Calculate from historical data
          totalReviews: tours.reduce((sum: number, tour: Record<string, unknown>) => sum + Number(tour.review_count || 0), 0),
        },
        recentBookings,
        popularTours,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Return empty data structure on error
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
  }
};
