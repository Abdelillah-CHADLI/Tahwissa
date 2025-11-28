import type { DashboardData } from '../types/dashboard';
import { bookingService, tourService, reviewService } from './api';
import { mockTours } from '../data/mockTours';
import { bookings as mockBookings } from '../data/bookings';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Get agency ID from localStorage
      const agencyId = localStorage.getItem('agencyId') || '1';
      
      let bookings = [];
      let tours = [];

      try {
        // Fetch bookings for this agency
        const bookingsResponse = await bookingService.getBookings({ agencyId });
        bookings = bookingsResponse.data || [];
      } catch (e) {
        console.warn('Failed to fetch bookings, using mock data');
        bookings = mockBookings;
      }
      
      try {
        // Fetch tours
        const toursResponse = await tourService.getTours();
        tours = toursResponse.data || [];
      } catch (e) {
        console.warn('Failed to fetch tours, using mock data');
        tours = mockTours;
      }

      // If API returns empty arrays, fallback to mock data
      if (bookings.length === 0) bookings = mockBookings;
      if (tours.length === 0) tours = mockTours;
      
      // Calculate stats
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed').length;
      
      // Get recent bookings (last 3)
      const recentBookings = bookings.slice(0, 3).map((booking: any) => ({
        id: String(booking.booking_id || booking.id || ''),
        tour: String(booking.tour_name || booking.tour || 'Unknown Tour'),
        traveler: String(booking.traveller_name || booking.customerName || booking.traveler || 'Unknown'),
        date: String(booking.booking_date || booking.date || 'N/A'),
        status: (booking.status as 'confirmed' | 'pending' | 'cancelled') || 'pending',
        amount: `${booking.total_price || booking.totalPrice || 0} DZD`,
      }));
      
      // Get popular tours (top 3 by bookings or default to first 3)
      const popularTours = tours.slice(0, 3).map((tour: any) => ({
        name: String(tour.title || tour.name || 'Untitled Tour'),
        bookings: Number(tour.bookings || 0),
        views: Number(tour.views || 0),
        rating: Number(tour.rating || 4.5),
      }));
      
      // Calculate average rating from tours
      const totalRating = tours.reduce((sum: number, tour: any) => sum + Number(tour.rating || 0), 0);
      const averageRating = tours.length > 0 ? totalRating / tours.length : 0;
      
      return {
        stats: {
          activeTours: tours.filter((t: any) => t.status === 'Active' || t.status === 'active').length,
          totalBookings,
          averageRating: parseFloat(averageRating.toFixed(1)),
          monthlyBookingChange: 18, // TODO: Calculate from historical data
          totalReviews: tours.reduce((sum: number, tour: any) => sum + Number(tour.review_count || 0), 0),
        },
        recentBookings,
        popularTours,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Return mock data on critical error
      return {
        stats: {
          activeTours: mockTours.length,
          totalBookings: mockBookings.length,
          averageRating: 4.5,
          monthlyBookingChange: 12,
          totalReviews: 150,
        },
        recentBookings: mockBookings.slice(0, 3).map((booking: any) => ({
            id: String(booking.id),
            tour: String(booking.tour),
            traveler: String(booking.customerName),
            date: String(booking.date),
            status: booking.status,
            amount: `${booking.totalPrice} DZD`,
        })),
        popularTours: mockTours.slice(0, 3).map((tour: any) => ({
            name: String(tour.title),
            bookings: Number(tour.bookings || 0),
            views: 100,
            rating: 4.5,
        })),
      };
    }
  }
};
