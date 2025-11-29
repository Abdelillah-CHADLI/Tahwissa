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
  };
}

interface ProfileResponse {
  userType?: string;
  role?: string;
  type?: string;
  [key: string]: unknown; 
}

// Helper function to extract user type from profile data
const extractUserType = (profileData: ProfileResponse): string => {
  if (profileData.userType) return profileData.userType;
  if (profileData.role) return profileData.role.toLowerCase();
  if (profileData.type) return profileData.type.toLowerCase();
  return 'traveller';
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Step 1: Authenticate user (token will be set in cookie by backend)
      const loginResponse = await api.post<BackendLoginResponse>('/auth/login', credentials);
      
      const userId = loginResponse.data.user.id;
      
      // Step 2: Fetch user profile to get userType
      let userType = 'traveller';
      try {
        const profileResponse = await api.get<ProfileResponse>(`/profile/${userId}`);
        userType = extractUserType(profileResponse.data);
      } catch (profileError) {
        console.warn('Could not fetch user profile:', profileError);
      }
      
      const user: User = {
        id: userId,
        email: loginResponse.data.user.email,
        userType: userType,
        name: loginResponse.data.user.name,
      };
      
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
      
      const user: User = {
        id: backendData.userId,
        email: backendData.email,
        userType: backendData.role.toLowerCase(),
        firstName: backendData.first_name,
        lastName: backendData.last_name,
        guideName: backendData.guideName,
        agencyName: backendData.agencyName,
        agencyId: backendData.agencyId,
        isManager: backendData.isManager
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
    // Call backend logout to clear cookie
    api.post('/auth/logout', {}, { withCredentials: true });
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