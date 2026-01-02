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
  return 'traveller';
};

const determineProfileId = (backendData: any, userType: string): string => {
  switch (userType) {
    case 'agency':
      return backendData.agencyId || backendData.userId || backendData.id;
    case 'guide':
      return backendData.guideId || backendData.userId || backendData.id;
    case 'traveller':
    default:
      return backendData.userId || backendData.id;
  }
};

export const authService = {

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {

      const loginResponse = await api.post('/auth/login', credentials, { withCredentials: true });

      const data = loginResponse.data;

      const normalizedUserType =
      data?.role?.toLowerCase() === 'admin'
        ? 'admin'
        : data?.role
          ? normalizeUserType(data.role)
          : 'traveller';
      const userId = String(data.id);
      const agencyId = data?.agencyId ? String(data.agencyId) : undefined;
      const agencyName = data?.agencyName ? String(data.agencyName) : undefined;
      const isManager = typeof data?.isManager === 'boolean' ? data.isManager : undefined;

      const profileId = normalizedUserType === 'agency'
        ? (agencyId || userId)
        : userId;

      const user: User = {
        id: userId,
        email: data.email,
        userType: normalizedUserType,
        profileId,
        profileType: normalizedUserType,
        userId: userId,
        role: data.role,
        name: data.email?.split("@")[0],
        agencyId,
        agencyName,
        isManager,
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
        profileId: profileId,
        profileType: userType,
        userId: backendData.userId,
        isManager: isManager,
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
    localStorage.removeItem('user');
    api.post('/auth/logout', undefined, { withCredentials: true }).catch(error => {
      console.warn('Backend logout failed:', error.message);
    });
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};