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

export const authService = {

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {

      const loginResponse = await api.post('/auth/login', credentials);

      const data = loginResponse.data; 
      // data = { id, email, role }

      const user: User = {
        id: data.id,
        email: data.email,
        userType: data.role,   // use backend role
        name: data.email.split("@")[0], // temporary name if you want
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