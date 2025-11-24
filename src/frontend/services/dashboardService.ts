import type { DashboardData } from '../types/dashboard';

const getMockDashboardData = (): DashboardData => {
  return {
    stats: {
      activeTours: 12,
      totalBookings: 156,
      averageRating: 4.8,
      monthlyBookingChange: 18,
      totalReviews: 89,
    },
    recentBookings: [
      {
        id: "1",
        tour: "Sahara Desert Adventure",
        traveler: "Ahmed Mansour",
        date: "Nov 15-18, 2024",
        status: "confirmed",
        amount: "12,500 DZD",
      },
      {
        id: "2",
        tour: "Mediterranean Coastal Tour",
        traveler: "Sarah Johnson",
        date: "Nov 22, 2024",
        status: "pending",
        amount: "8,500 DZD",
      },
      {
        id: "3",
        tour: "Atlas Mountains Trek",
        traveler: "Mohammed Ali",
        date: "Dec 5-10, 2024",
        status: "confirmed",
        amount: "15,000 DZD",
      },
    ],
    popularTours: [
      {
        name: "Sahara Desert Adventure",
        bookings: 45,
        views: 1240,
        rating: 4.9,
      },
      {
        name: "Mediterranean Coastal Tour",
        bookings: 38,
        views: 980,
        rating: 4.8,
      },
      {
        name: "Atlas Mountains Trek",
        bookings: 32,
        views: 856,
        rating: 5.0,
      },
    ],
  };
};


export const dashboardService = {
  // TODO: Replace with actual API call when backend is ready
  async getDashboardData(): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock data for now
    return getMockDashboardData();
  }
};
