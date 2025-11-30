import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Base axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  //withCredentials: true,
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

export default api;

export const profileService = {
  getProfile: async (id: string, type: 'agency' | 'guide') => {
    const response = await api.get(`/api/profile/${id}`, {
      params: { type }
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
};

export const tourService = {
  getTours: async (limit?: number) => {
    const response = await api.get('/tour/gettours', {
      params: { limit }
    });
    return response.data;
  },

  getAgencyTours: async (agencyId: string) => {
    const response = await api.get('/api/tours/browse', {
      params: { provider: 'agency', size: 100 }
    });
    const result = response.data?.data || response.data;
    const tours = result?.tours || [];
    return tours.filter((tour: Record<string, unknown>) => String(tour.agency_id) === agencyId);
  },

  getTourById: async (tourId: string) => {
    const response = await api.get('/tour/gettours');
    const tours = Array.isArray(response.data) ? response.data : [];
    return tours.find((t: Record<string, unknown>) =>
      String(t.tour_id) === tourId || String(t.id) === tourId
    ) || null;
  },

  searchTours: async (searchParams: {
    name?: string;
    region?: string;
    category?: string;
    budget?: string;
    provider?: string;
  }) => {
    const response = await api.post('/tour/searchTours', searchParams);
    return response.data;
  },

  createTour: async (tourData: Record<string, unknown>) => {
    const agencyId = localStorage.getItem('agencyId') || '1';
    const backendData = {
      tour_title: tourData.title,
      location: tourData.location,
      price: Number(tourData.price) || 0,
      group_size: tourData.groupSize,
      duration: tourData.duration,
      agency_id: agencyId,
      tour_details: tourData.days || tourData.description,
      tour_included: tourData.included,
      start_date: new Date().toISOString().split('T')[0],
      category: tourData.category
    };
    const response = await api.post('/api/tours', backendData);
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
    const response = await api.get(`/manager/employees`, {
      params: { agency_id: agencyId }
    });
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
  updateEmployee: async (employeeId: string, data: {
    email?: string;
    name?: string;
    role?: string;
    phone?: string;
    status?: string;
  }) => {
    const response = await api.put(`/manager/employees/${employeeId}`, data);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (employeeId: string) => {
    const response = await api.delete(`/manager/employees/${employeeId}`);
    return response.data;
  },
};

export const advancedBookingService = {
  // Confirm a booking
  confirmBooking: async (bookingId: string) => {
    const response = await api.put(`/api/bookings/${bookingId}/confirm`);
    return response.data;
  },

  // Cancel/Decline a booking
  cancelBooking: async (bookingId: string, reason?: string) => {
    const response = await api.put(`/api/bookings/${bookingId}/cancel`, {
      reason
    });
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, status: string) => {
    const response = await api.put(`/api/bookings/${bookingId}/status`, {
      status
    });
    return response.data;
  },

  // Get booking details
  getBookingDetails: async (bookingId: string) => {
    const response = await api.get(`/api/bookings/${bookingId}`);
    return response.data;
  },

};