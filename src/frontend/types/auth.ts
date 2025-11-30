export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'traveller' | 'guide' | 'agency';
  
  firstName?: string;
  lastName?: string;
  
  agencyName?: string;
  location?: string;
  phoneNumber?: string;
  
  guideName?: string;
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
  userType: 'traveller' | 'guide' | 'agency'; // Now strictly typed
  firstName?: string;
  lastName?: string;
  guideName?: string;
  agencyName?: string;
  
  // Profile information for routing (added)
  profileId: string;       // agencyId, guideId, or userId
  profileType: 'traveller' | 'guide' | 'agency';
  userId: string;          // logged-in user ID
  isManager?: boolean;     // for agency employees
  
  // Backend fields (optional)
  role?: string;
  agencyId?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
}