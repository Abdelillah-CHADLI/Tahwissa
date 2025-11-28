import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add token from localStorage if exists
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // no response
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

// API service functions
export const profileService = {
  // Get profile (Agency or Guide)
  getProfile: async (id: string, typeOfProfile: 'Agency' | 'Guide') => {
    const response = await api.get(`/profile/${id}`, {
      params: { TypeOfProfile: typeOfProfile }
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (id: string, data: Record<string, unknown>, typeOfProfile: 'Agency' | 'Guide') => {
    const response = await api.put(`/profile/${id}`, {
      ...data,
      TypeOfProfile: typeOfProfile
    });
    return response.data;
  },
};

export const tourService = {
  // Get tours
  getTours: async (limit?: number) => {
    const response = await api.get('/tour/gettours', {
      params: { limit }
    });
    return response.data;
  },

  // Search tours
  searchTours: async (searchParams: Record<string, unknown>) => {
    const response = await api.post('/tour/searchTours', searchParams);
    return response.data;
  },

  // Browse tours with filters
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
  // Get bookings by filter
  getBookings: async (filters: {
    agencyId?: string;
    guideId?: string;
    travellerName?: string;
    status?: string;
  }) => {
    const response = await api.get('/api/bookings', { params: filters });
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData: {
    traveller_id: string;
    tour_id: string;
  }) => {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (userId: string) => {
    const response = await api.get('/api/bookings/explore', {
      params: { userId }
    });
    return response.data;
  },
};

export const reviewService = {
  // Add review
  addReview: async (reviewData: {
    tour_id: string;
    traveller_id: string;
    comment?: string;
    review_score: number;
  }) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },

  // Get reviews for a tour
  getReviewsByTour: async (tourId: string) => {
    const response = await api.get(`/api/reviews/${tourId}`);
    return response.data;
  },
};

export const agencyService = {
  // Browse agencies
  browseAgencies: async (page: number = 1, size: number = 10) => {
    const response = await api.get('/api/agencies/browse', {
      params: { page, size }
    });
    return response.data;
  },

  // Search agencies
  searchAgencies: async (search: string, limit: number = 10) => {
    const response = await api.get('/api/agencies', {
      params: { search, limit }
    });
    return response.data;
  },
};

export const guideService = {
  // Search guides
  searchGuides: async (search: string, limit: number = 10) => {
    const response = await api.get('/api/guides', {
      params: { search, limit }
    });
    return response.data;
  },
};
