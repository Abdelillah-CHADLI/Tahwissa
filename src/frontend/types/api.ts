// API Types
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

export interface TourSearchParams {
  location?: string;
  category?: string;
  priceRange?: { min: number; max: number };
  duration?: string;
}

export interface TourFilters {
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
