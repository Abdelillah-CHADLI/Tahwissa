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
    role?: string;
    name?: string;
    agencyId?: string;
    guideName?: string;
    isManager?: boolean;
  };
}

const determineUserType = (backendUser: any): 'traveller' | 'guide' | 'agency' => {
  if (backendUser.userType && ['traveller', 'guide', 'agency'].includes(backendUser.userType)) {
    return backendUser.userType;
  }
  if (backendUser.role) {
    return normalizeUserType(backendUser.role);
  }
  return 'traveller';
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
      console.log('=== AUTH SERVICE DEBUG START ===');
      console.log('Sending login request to /auth/login');
      console.log('Credentials:', { email: credentials.email, password: '[HIDDEN]' });

      const loginResponse = await api.post<any>('/auth/login', credentials);

      console.log('RAW AXIOS RESPONSE:', loginResponse);
      console.log('RESPONSE STATUS:', loginResponse.status);
      console.log('RESPONSE HEADERS:', loginResponse.headers);
      console.log('RESPONSE DATA:', loginResponse.data);
      console.log('RESPONSE DATA TYPE:', typeof loginResponse.data);
      console.log('RESPONSE DATA KEYS:', Object.keys(loginResponse.data));

      const backendUser = loginResponse.data.user;
      console.log('BACKEND USER:', backendUser);
      console.log('BACKEND USER TYPE:', typeof backendUser);

      if (backendUser) {
        console.log('BACKEND USER KEYS:', Object.keys(backendUser));
        console.log('BACKEND USER.id:', backendUser.id);
        console.log('BACKEND USER.email:', backendUser.email);
        console.log('BACKEND USER.role:', backendUser.role);
        console.log('BACKEND USER.name:', backendUser.name);
        console.log('BACKEND USER.agencyId:', backendUser.agencyId);
        console.log('BACKEND USER.guideName:', backendUser.guideName);
        console.log('BACKEND USER.isManager:', backendUser.isManager);
      } else {
        console.log('BACKEND USER IS NULL OR UNDEFINED');
      }

      if (!backendUser) {
        throw new Error('No user data received from backend');
      }

      const userType = determineUserType(backendUser);
      const profileId = determineProfileId(backendUser, userType);
      const isManager = backendUser.isManager || false;

      console.log('DETERMINED USER TYPE:', userType);
      console.log('DETERMINED PROFILE ID:', profileId);
      console.log('DETERMINED IS MANAGER:', isManager);

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        userType: userType,
        name: backendUser.name,
        profileId: profileId,
        profileType: userType,
        userId: backendUser.id,
        isManager: isManager,
        role: backendUser.role,
        agencyId: backendUser.agencyId,
        guideName: backendUser.guideName
      };

      console.log('FINAL USER OBJECT:', user);
      console.log('=== AUTH SERVICE DEBUG END ===');

      return {
        success: true,
        message: 'Login successful',
        user: user
      };
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('AXIOS ERROR DETAILS:', {
        message: axiosError.message,
        code: axiosError.code,
        status: axiosError.response?.status,
        responseData: axiosError.response?.data
      });
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
    api.post('/auth/logout').catch(error => {
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