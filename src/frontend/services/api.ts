import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Base axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
  // Fetch profile data
  getProfile: async (id: string, typeOfProfile: 'Agency' | 'Guide') => {
    const response = await api.get(`/profile1/${id}`, {
      params: { TypeOfProfile: typeOfProfile }
    });
    return response.data;
  },

  // Update profile data
  updateProfile: async (id: string, data: Record<string, unknown>, typeOfProfile: 'Agency' | 'Guide') => {
    const response = await api.put(`/profile1/${id}`, {
      ...data,
      TypeOfProfile: typeOfProfile
    });
    return response.data;
  },
};

export const tourService = {
  // Fetch all tours
  getTours: async (limit?: number) => {
    const response = await api.get('/tour/gettours', {
      params: { limit }
    });
    return response.data;
  },

  // Search tours with criteria
  searchTours: async (searchParams: Record<string, unknown>) => {
    const response = await api.post('/tour/searchTours', searchParams);
    return response.data;
  },

  // Create a new tour
  createTour: async (tourData: FormData | Record<string, unknown>) => {
    const response = await api.post('/tour/create', tourData);
    return response.data;
  },

  // Filter and browse tours
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
  // Fetch bookings with filters
  getBookings: async (filters: {
    agencyId?: string;
    guideId?: string;
    travellerName?: string;
    status?: string;
  }) => {
    const response = await api.get('/api/bookings', { params: filters });
    return response.data;
  },

  // Create a new booking
  createBooking: async (bookingData: {
    traveller_id: string;
    tour_id: string;
  }) => {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },

  // Fetch bookings for a specific user
  getUserBookings: async (userId: string) => {
    const response = await api.get('/api/bookings/explore', {
      params: { userId }
    });
    return response.data;
  },
};

export const reviewService = {
  // Submit a review
  addReview: async (reviewData: {
    tour_id: string;
    traveller_id: string;
    comment?: string;
    review_score: number;
  }) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },

  // Fetch reviews for a tour
  getReviewsByTour: async (tourId: string) => {
    const response = await api.get(`/api/reviews/${tourId}`);
    return response.data;
  },
};

export const agencyService = {
  // List agencies with pagination
  browseAgencies: async (page: number = 1, size: number = 10) => {
    const response = await api.get('/api/agencies/browse', {
      params: { page, size }
    });
    return response.data;
  },

  // Search agencies by name
  searchAgencies: async (search: string, limit: number = 10) => {
    const response = await api.get('/api/agencies', {
      params: { search, limit }
    });
    return response.data;
  },
};

export const guideService = {
  // Search guides by name
  searchGuides: async (search: string, limit: number = 10) => {
    const response = await api.get('/api/guides', {
      params: { search, limit }
    });
    return response.data;
  },
};
