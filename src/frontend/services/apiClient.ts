interface ApiParams {
  [key: string]: string | number | boolean | undefined;
}

interface SearchFilters {
  region?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
}

interface SearchRequest {
  query: string;
  filters?: SearchFilters;
}

interface UserProfileData {
  name?: string;
  email?: string;
  preferences?: string[];
}

interface FilterOptions {
  regions: string[];
  categories: string[];
  priceRanges: string[];
}

interface MockEndpoints {
  [key: string]: () => Promise<unknown>;
}

class ApiClient {
  private baseURL: string;
  private useMockData: boolean;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.useMockData = !import.meta.env.VITE_API_BASE_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (this.useMockData) {
      return this.mockRequest(endpoint);
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async mockRequest(endpoint: string): Promise<unknown> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockEndpoints: MockEndpoints = {
      '/tours': () => import('../../frontend/data/tours').then(module => module.mockTours),
      '/tours/search': () => import('../../frontend/data/tours').then(module => module.mockTours),
      '/tours/filters': () => Promise.resolve({
        regions: ['Algiers', 'Oran', 'Constantine', 'Tamanrasset', 'Tlemcen'],
        categories: ['Desert Tours', 'Mountain Hiking', 'Coastal Adventures', 'Cultural Tours', 'Historical Sites'],
        priceRanges: ['Under 5,000 DZD', '5,000 - 10,000 DZD', '10,000 - 20,000 DZD', 'Over 20,000 DZD']
      } as FilterOptions)
    };

    const mockHandler = mockEndpoints[endpoint];
    if (mockHandler) {
      return mockHandler();
    }

    throw new Error(`Mock endpoint not found: ${endpoint}`);
  }

  async getTours(params?: ApiParams): Promise<unknown> {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.request(`/tours${queryString ? `?${queryString}` : ''}`);
  }

  async searchTours(query: string, filters?: SearchFilters): Promise<unknown> {
    const searchRequest: SearchRequest = { query, filters };
    return this.request('/tours/search', {
      method: 'POST',
      body: JSON.stringify(searchRequest)
    });
  }

  async getTourById(id: string): Promise<unknown> {
    return this.request(`/tours/${id}`);
  }

  async getFilterOptions(): Promise<FilterOptions> {
    return this.request('/tours/filters') as Promise<FilterOptions>;
  }

  async getUserProfile(): Promise<unknown> {
    return this.request('/users/profile');
  }

  async updateUserProfile(data: UserProfileData): Promise<unknown> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}

export const apiClient = new ApiClient();