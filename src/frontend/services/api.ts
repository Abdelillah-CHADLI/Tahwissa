import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getCurrentAgencyUuid, getCurrentProfileType } from '../utils/session';

// Base axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  //withCredentials: true, // ENABLED for cookie-based auth
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data: any = err.response?.data;
    if (typeof data?.error === 'string' && data.error.trim()) return data.error;
    if (typeof data?.message === 'string' && data.message.trim()) return data.message;
    if (typeof err.message === 'string' && err.message.trim()) return err.message;
    return `Request failed${err.response?.status ? ` (${err.response.status})` : ''}`;
  }
  return err instanceof Error ? err.message : 'Request failed';
}

export default api;

export const profileService = {
  getProfile: async (id: string, type: 'agency' | 'guide') => {
    const TypeOfProfile = type === 'agency' ? 'Agency' : 'Guide';
    const response = await api.get(`/profile1/${id}`, {
      params: { TypeOfProfile }
    });
    return response.data;
  },

  updateProfile: async (id: string, data: Record<string, unknown>, type: 'agency' | 'guide') => {
    const TypeOfProfile = type === 'agency' ? 'Agency' : 'Guide';
    const response = await api.put(`/profile1/${id}`, {
      ...data,
      TypeOfProfile
    });
    return response.data;
  },

  getTravellerInfo: async (id: string) => {
    const response = await api.get(`/profile1/traveller/${id}`);
    return response.data;
  },

  updateTravellerInfo: async (id: string, data: {
    traveller_fn?: string;
    traveller_ls?: string;
    bio?: string;
    phone_number?: string;
    location?: string;
    email?: string;
  }) => {
    const response = await api.post(`/profile1/traveller/${id}`, data);
    return response.data;
  },
};

export const tourService = {
  getTours: async (limit?: number) => {
    try {
      const response = await api.get('/tour/gettours', {
        params: { limit }
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Get tours error:', error);
      return [];
    }
  },

  // Updated searchTours function to match backend
  searchTours: async (searchParams: {
    name?: string;
    region?: string;
    category?: string;
    budget?: string;
    provider?: string;
  }) => {
    try {
      // Use POST request with request body as backend expects
      const response = await api.post('/tour/searchTours', searchParams);

      // Backend returns direct array
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Search endpoint failed:', error);

      // Fallback: Get all tours and filter client-side
      try {
        const allTours = await tourService.getTours(100);

        return allTours.filter((tour: any) => {
          let matches = true;

          // Name filter
          if (searchParams.name) {
            matches = matches && tour.tour_title?.toLowerCase().includes(searchParams.name.toLowerCase());
          }

          // Region filter
          if (searchParams.region && searchParams.region !== "All Regions") {
            matches = matches && tour.location?.toLowerCase().includes(searchParams.region.toLowerCase());
          }

          // Category filter
          if (searchParams.category && searchParams.category !== "All Categories") {
            matches = matches && tour.category === searchParams.category;
          }

          // Budget filter
          if (searchParams.budget && searchParams.budget !== "All Budgets") {
            const price = Number(tour.price) || 0;
            const budgetRanges = {
              '<5000': price < 5000,
              '5000-10000': price >= 5000 && price <= 10000,
              '10000-20000': price >= 10000 && price <= 20000,
              '>20000': price > 20000
            };
            matches = matches && budgetRanges[searchParams.budget as keyof typeof budgetRanges];
          }

          // Provider filter
          if (searchParams.provider && searchParams.provider !== "All Providers") {
            if (searchParams.provider === 'Guide') {
              matches = matches && (tour.guide_id !== null && tour.guide_id !== undefined);
            } else if (searchParams.provider === 'Agency') {
              matches = matches && (tour.agency_id !== null && tour.agency_id !== undefined);
            }
          }

          return matches;
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error('Search functionality is currently unavailable');
      }
    }
  },

  createTour: async (tourData: Record<string, unknown>) => {
    const profileId = getCurrentAgencyUuid();
    const profileType = getCurrentProfileType();

    if (!profileId || !profileType) {
      throw new Error('Account not detected. Please sign out and sign back in.');
    }

    const asNonEmptyStringArray = (v: unknown): string[] | null => {
      if (!Array.isArray(v)) return null;
      const cleaned = v
        .map((x) => (typeof x === 'string' ? x.trim() : ''))
        .filter((x) => x.length > 0);
      return cleaned.length ? cleaned : null;
    };

    const safeJson = (v: unknown): string | null => {
      if (v == null) return null;
      if (typeof v === 'string') {
        const s = v.trim();
        if (!s || s === 'undefined' || s === 'null') return null;
        try {
          JSON.parse(s);
          return s;
        } catch {
          return JSON.stringify(s);
        }
      }
      try {
        return JSON.stringify(v);
      } catch {
        return null;
      }
    };

    const backendData: Record<string, unknown> = {
      tour_title: String(tourData.title ?? ''),
      location: String(tourData.location ?? ''),
      price: Number(tourData.price),
      start_date: String(tourData.startDate ?? new Date().toISOString().split('T')[0]),

      agency_id: profileType === 'agency' ? profileId : null,
      guide_id: profileType === 'guide' ? profileId : null,

      group_size: tourData.groupSize ?? null,
      duration: tourData.duration ?? null,
      category: tourData.category ?? null,
      tour_details: safeJson((tourData as any).days ?? tourData.agency_description ?? null),
      tour_included: safeJson(asNonEmptyStringArray((tourData as any).included)),
      requirements: safeJson(asNonEmptyStringArray((tourData as any).requirements)),
      tour_not_included: safeJson(
        asNonEmptyStringArray((tourData as any).notIncluded ?? (tourData as any).tour_not_included)
      ),
    };

    const deepSanitize = (value: any): any => {
      if (value == null) return undefined;
      if (typeof value === 'string') {
        const s = value.trim();
        if (!s || s === 'undefined' || s === 'null') return undefined;
        return s;
      }
      if (Array.isArray(value)) {
        const arr = value.map(deepSanitize).filter((v) => v !== undefined);
        return arr.length ? arr : undefined;
      }
      if (typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) {
          const sv = deepSanitize(v);
          if (sv !== undefined) out[k] = sv;
        }
        return Object.keys(out).length ? out : undefined;
      }
      // numbers/booleans
      return value;
    };

    const payload = (deepSanitize(backendData) as Record<string, unknown>) || {};

    if (!payload.tour_title) throw new Error('Title is required');
    if (!payload.location) throw new Error('Location is required');
    if (!Number.isFinite(payload.price as number)) throw new Error('Price must be a valid number');

    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null) continue;
      formData.append(key, typeof value === 'string' ? value : String(value));
    }

    const imageFiles = (tourData as any).imageFiles as File[] | undefined;
    if (Array.isArray(imageFiles)) {
      for (const file of imageFiles) {
        if (file instanceof File) {
          formData.append('images', file);
        }
      }
    }

    const response = await api.post('/api/tours', formData);
    return response.data;
  },

  browseTours: async (page: number = 1, size: number = 10, filters?: {
    cat?: string[];
    regions?: string[];
    priceMin?: number;
    priceMax?: number;
    provider?: 'agency' | 'guide';
  }) => {
    const params: Record<string, unknown> = { page, size };
    if (filters) {
      if (filters.cat) params.cat = filters.cat.join(',');
      if (filters.regions) params.regions = filters.regions.join(',');
      if (filters.priceMin) params.priceMin = filters.priceMin;
      if (filters.priceMax) params.priceMax = filters.priceMax;
      if (filters.provider) params.provider = filters.provider;
    }
    const response = await api.get('/api/tours/browse', { params });
    return response.data;
  },

  getAgencyTours: async (profileId: string, profileType?: 'agency' | 'guide') => {
    const type = profileType || getCurrentProfileType() || 'agency';
    const response = await api.get('/api/tours/browse', {
      params: { size: 100 }
    });
    const result = response.data?.data || response.data;
    const tours = result?.tours || [];
    const idKey = type === 'agency' ? 'agency_id' : 'guide_id';
    return tours.filter((tour: Record<string, unknown>) => String(tour[idKey]) === profileId);
  },

  getTourById: async (tourId: string) => {
    try {
      const response = await api.get('/api/tours/browse');

      // Check if request was successful
      if (!response.data?.success) {
        console.error('API request failed');
        return null;
      }

      // Correct path: response.data.data.tours
      const tours = Array.isArray(response.data?.data?.tours)
        ? response.data.data.tours
        : [];

      // Find the specific tour
      const foundTour = tours.find((t: any) =>
        String(t.tour_id) === tourId || String(t.id) === tourId
      );

      return foundTour || null;

    } catch (error) {
      console.error('Error fetching tour by ID:', error);
      return null;
    }
  },

  deleteTour: async (tourId: string) => {
    const response = await api.delete(`/api/tours/${tourId}`);
    return response.data;
  }
};

export const bookingService = {
  getBookings: async (filters: {
    agencyId?: string;
    guideId?: string;
    travellerName?: string;
    status?: string;
  }) => {
    const response = await api.get('/api/bookings', { params: filters });
    return response.data;
  },

  createBooking: async (bookingData: {
    traveller_id: string;
    tour_id: string;
  }) => {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async (userId: string) => {
    const response = await api.get('/api/bookings/explore', {
      params: { userId }
    });
    return response.data;
  },
};
export const agencyService = {
  browseAgencies: async (page: number = 1, size: number = 10) => {
    const response = await api.get('/api/agencies/browse', {
      params: { page, size }
    });
    return response.data;
  },

  searchAgencies: async (search: string, limit: number = 10) => {
    const response = await api.get('/api/agencies', {
      params: { search, limit }
    });
    return response.data;
  },
};

export const guideService = {
  searchGuides: async (search: string, limit: number = 10) => {
    const response = await api.get('/api/guides', {
      params: { search, limit }
    });
    return response.data;
  },

  browseGuides: async (page: number = 1, size: number = 10) => {
    const response = await api.get('/api/guides', {
      params: { page, limit: size }
    });
    return response.data;
  },
};

export const reviewService = {
  // Get all reviews for an agency
  getAgencyReviews: async (agencyId: string, filters?: {
    sortBy?: 'recent' | 'rating' | 'helpful';
    tourId?: string;
    minRating?: number;
  }) => {
    const response = await api.get(`/api/reviews/agency/${agencyId}`, {
      params: filters
    });
    return response.data;
  },

  // Get reviews for a specific tour
  getReviewsByTour: async (tourId: string) => {
    const response = await api.get(`/api/reviews/${tourId}`);
    return response.data;
  },

  // Get overall stats for agency reviews
  getAgencyReviewStats: async (agencyId: string) => {
    const response = await api.get(`/api/reviews/agency/${agencyId}/stats`);
    return response.data;
  },

  // Mark review as helpful
  markReviewHelpful: async (reviewId: string) => {
    const response = await api.post(`/api/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Reply to a review
  replyToReview: async (reviewId: string, replyText: string) => {
    const response = await api.post(`/api/reviews/${reviewId}/reply`, {
      reply_text: replyText
    });
    return response.data;
  },

  // Add a review (from traveler)
  addReview: async (reviewData: {
    tour_id: string;
    traveller_id: string;
    comment?: string;
    review_score: number;
  }) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },
};

export const settingsService = {
  // Get account settings
  getAccountSettings: async (agencyId: string) => {
    const response = await api.get(`/api/settings/account/${agencyId}`);
    return response.data;
  },

  // Update account settings
  updateAccountSettings: async (agencyId: string, data: {
    agency_name?: string;
    email?: string;
    phone?: string;
  }) => {
    const response = await api.put(`/api/settings/account/${agencyId}`, data);
    return response.data;
  },

  // Change password
  changePassword: async (agencyId: string, data: {
    current_password: string;
    new_password: string;
  }) => {
    const response = await api.post(`/api/settings/password/${agencyId}`, data);
    return response.data;
  },

  // Get notification preferences
  getNotificationSettings: async (agencyId: string) => {
    const response = await api.get(`/api/settings/notifications/${agencyId}`);
    return response.data;
  },

  // Update notification preferences
  updateNotificationSettings: async (agencyId: string, settings: {
    email_notifications?: boolean;
    booking_alerts?: boolean;
    review_alerts?: boolean;
    promotional_emails?: boolean;
    weekly_report?: boolean;
  }) => {
    const response = await api.put(`/api/settings/notifications/${agencyId}`, settings);
    return response.data;
  },

  // Get payment settings
  getPaymentSettings: async (agencyId: string) => {
    const response = await api.get(`/api/settings/payment/${agencyId}`);
    return response.data;
  },

  // Update payment settings
  updatePaymentSettings: async (agencyId: string, data: {
    account_holder?: string;
    bank_name?: string;
    account_number?: string;
    swift_code?: string;
  }) => {
    const response = await api.put(`/api/settings/payment/${agencyId}`, data);
    return response.data;
  },

  // Get privacy settings
  getPrivacySettings: async (agencyId: string) => {
    const response = await api.get(`/api/settings/privacy/${agencyId}`);
    return response.data;
  },

  // Update privacy settings
  updatePrivacySettings: async (agencyId: string, settings: {
    profile_visibility?: boolean;
    show_contact_info?: boolean;
    allow_reviews?: boolean;
  }) => {
    const response = await api.put(`/api/settings/privacy/${agencyId}`, settings);
    return response.data;
  },
};

export const employeeService = {
  // Get all employees for an agency
  getEmployees: async (agencyId: string) => {
    const response = await api.get(`/manager/employeesOp/${agencyId}`);
    return response.data;
  },

  // Create new employee
  createEmployee: async (employeeData: {
    email: string;
    password: string;
    agency_id: string;
    name: string;
    role: string;
    phone: string;
  }) => {
    const response = await api.post('/manager/employees', employeeData);
    return response.data;
  },

  // Update employee
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateEmployee: async (_employeeId: string, _data: {
    email?: string;
    name?: string;
    role?: string;
    phone?: string;
    status?: string;
  }) => {
    return null;
  },

  // Delete employee
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteEmployee: async (_employeeId: string) => {
    return null;
  },
};

export const advancedBookingService = {
  // Confirm a booking
  confirmBooking: async (bookingId: string) => {
    const response = await api.patch(`/api/bookings/${bookingId}/confirm`);
    return response.data;
  },

  // Cancel a booking
  cancelBooking: async (bookingId: string) => {
    const response = await api.patch(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  },

};
