import { apiClient } from './apiClient';
import type { LoginRequest, SignupRequest, AuthResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.login(credentials);
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    return apiClient.signup(userData);
  }
};