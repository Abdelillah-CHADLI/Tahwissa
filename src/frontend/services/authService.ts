import api from './api';
import type { LoginRequest, SignupRequest, AuthResponse, User } from '../types/auth';
import type { AxiosError } from 'axios';

interface BackendSignupResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    role: string;
    first_name?: string;
    last_name?: string;
    agencyId?: string;
    agencyName?: string;
    isManager?: boolean;
    guideName?: string;
    location?: string;
  };
}

interface BackendLoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    // Backend might add these later
    role?: string;
    userType?: string;
    agencyId?: string;
    guideName?: string;
    isManager?: boolean;
  };
}

// HELPER FUNCTIONS (moved outside the object)
const determineUserType = (backendUser: any): 'traveller' | 'guide' | 'agency' => {
  // Priority: backend userType > backend role > default to 'traveller'
  if (backendUser.userType && ['traveller', 'guide', 'agency'].includes(backendUser.userType)) {
    return backendUser.userType;
  }
  if (backendUser.role) {
    return normalizeUserType(backendUser.role);
  }
  return 'traveller'; // Default fallback
};

const normalizeUserType = (role: string): 'traveller' | 'guide' | 'agency' => {
  const normalized = role.toLowerCase();
  if (normalized.includes('agency') || normalized.includes('employee')) {
    return 'agency';
  }
  if (normalized.includes('guide')) {
    return 'guide';
  }
  if (normalized.includes('traveller')) {
    return 'traveller';
  }
  return 'traveller'; // Default fallback
};

const determineProfileId = (backendData: any, userType: string): string => {
  // Determine the main profile ID for routing
  switch (userType) {
    case 'agency':
      return backendData.agencyId || backendData.userId;
    case 'guide':
      return backendData.guideId || backendData.userId;
    case 'traveller':
    default:
      return backendData.userId;
  }
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Authenticate user
      const loginResponse = await api.post<BackendLoginResponse>('/auth/login', credentials);
      
      console.log('FULL LOGIN RESPONSE:', loginResponse.data); // DEBUG
      
      const backendUser = loginResponse.data.user;
      
      // FALLBACK LOGIC: Use backend values when available, otherwise use defaults
      const userType = determineUserType(backendUser);
      const profileId = determineProfileId(backendUser, userType);
      const isManager = backendUser.isManager || false;
      
      const user: User = {
        id: backendUser.id || 'temp-id', // Fallback if id is missing
        email: backendUser.email,
        userType: userType,
        name: backendUser.name,
        // Profile information for routing
        profileId: profileId,
        profileType: userType,
        userId: backendUser.id || 'temp-id',
        isManager: isManager,
        // Backend fields (if available)
        role: backendUser.role,
        agencyId: backendUser.agencyId,
        guideName: backendUser.guideName
      };
      
      console.log('PROCESSED USER:', user); // DEBUG
      
      return {
        success: true,
        message: 'Login successful',
        user: user
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Login failed'
      };
    }
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<BackendSignupResponse>('/auth/signUp', userData);
      
      const backendData = response.data.data;
      
      // FALLBACK LOGIC: Use backend role when available, otherwise use submitted userType
      const userType = backendData.role ? 
        normalizeUserType(backendData.role) : 
        userData.userType;
      
      const profileId = determineProfileId(backendData, userType);
      const isManager = backendData.isManager || false;
      
      const user: User = {
        id: backendData.userId,
        email: backendData.email,
        userType: userType,
        firstName: backendData.first_name,
        lastName: backendData.last_name,
        guideName: backendData.guideName,
        agencyName: backendData.agencyName,
        // Profile information for routing
        profileId: profileId,
        profileType: userType,
        userId: backendData.userId,
        isManager: isManager,
        // Backend fields
        agencyId: backendData.agencyId
      };
      
      return {
        success: true,
        message: response.data.message,
        user: user
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Signup failed'
      };
    }
  },

  logout(): void {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Call backend logout
    api.post('/auth/logout').catch(error => {
      console.warn('Backend logout failed:', error.message);
    });
  },

  isAuthenticated(): boolean {
    // Check if we have user data (token is in cookie)
    return !!localStorage.getItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};