export interface DashboardStats {
  activeTours: number;
  totalBookings: number;
  averageRating: number;
  monthlyBookingChange: number;
  totalReviews: number;
}

export interface RecentBooking {
  id: string;
  tour: string;
  traveler: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: string;
}

export interface PopularTour {
  name: string;
  bookings: number;
  views: number;
  rating: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentBookings: RecentBooking[];
  popularTours: PopularTour[];
}

