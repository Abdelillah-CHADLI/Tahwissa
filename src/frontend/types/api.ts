export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ProfileData {
  agency_name?: string;
  agency_email?: string;
  agency_phone?: string;
  agency_website?: string;
  description?: string;
  location?: string;
  emergency_phone?: string;
  support_email?: string;
  working_hours?: string;
  guide_name?: string;
  guide_email?: string;
  guide_phone?: string;
}

export interface BackendTour {
  tour_id: string;
  tour_title: string;
  description?: string;
  price: number;
  rating?: number;
  image_url?: string;
  duration?: string;
  location: string;
  category: string;
  group_size?: string;
  guide_name?: string;
  guide_rating?: number;
  guide_tours_count?: number;
  agency_id?: string;
  guide_id?: string;
}

export interface SearchTourParams {
  name?: string;
  region?: string;
  category?: string;
  budget?: string;
  provider?: string;
}

export interface BrowseTourFilters {
  cat?: string[];
  regions?: string[];
  priceMin?: number;
  priceMax?: number;
  provider?: 'agency' | 'guide';
}

export interface BookingFilters {
  agencyId?: string;
  guideId?: string;
  travellerName?: string;
  status?: string;
}

export interface CreateBookingData {
  traveller_id: string;
  tour_id: string;
}

export interface ReviewData {
  tour_id: string;
  traveller_id: string;
  comment?: string;
  review_score: number;
}