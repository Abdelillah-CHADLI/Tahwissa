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
    return response.data?.data || response.data || [];
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

export const reviewService = {
  addReview: async (reviewData: {
    tour_id: string;
    traveller_id: string;
    comment?: string;
    review_score: number;
  }) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },

  getReviewsByTour: async (tourId: string) => {
    const response = await api.get(`/api/reviews/${tourId}`);
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
