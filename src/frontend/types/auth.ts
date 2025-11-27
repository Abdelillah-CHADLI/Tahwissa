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
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    userType: string;
    firstName?: string;
    lastName?: string;
    guideName?: string;
    agencyName?: string;
  };
}