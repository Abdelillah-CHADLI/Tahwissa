export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName?: string;
  lastName?: string;
  guideName?: string;
  agencyName?: string;
  location?: string;
  phoneNumber?: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'traveller' | 'guide' | 'agency';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  userType: string;
  firstName?: string;
  lastName?: string;
  guideName?: string;
  agencyName?: string;
  userId?: string;
  role?: string;
  agencyId?: string;
  isManager?: boolean;
  first_name?: string;
  last_name?: string;
  name?: string; 
}