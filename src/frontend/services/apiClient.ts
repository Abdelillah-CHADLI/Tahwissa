// services/apiClient.ts
interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
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

interface AuthResponse {
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

class ApiClient {
  private useMockData: boolean = true;

  private async mockRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const body = options.body ? JSON.parse(options.body as string) : {};

    if (endpoint === '/auth/login') {
      if (body.email === 'demo@example.com' && body.password === 'password') {
        return {
          success: true,
          message: 'Login successful',
          token: 'mock-jwt-token-123',
          user: {
            id: '1',
            email: body.email,
            userType: 'traveller',
            firstName: 'Demo',
            lastName: 'User'
          }
        } as AuthResponse;
      } else {
        return {
          success: false,
          message: 'Invalid email or password'
        } as AuthResponse;
      }
    }

    if (endpoint === '/auth/signUp') {
      return {
        success: true,
        message: 'Signup successful',
        token: 'mock-jwt-token-123',
        user: {
          id: '1',
          email: body.email,
          userType: body.userType,
          firstName: body.firstName,
          lastName: body.lastName,
          guideName: body.guideName,
          agencyName: body.agencyName
        }
      } as AuthResponse;
    }

    throw new Error(`Mock endpoint not found: ${endpoint}`);
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.mockRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }) as AuthResponse;

    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await this.mockRequest('/auth/signUp', {
      method: 'POST',
      body: JSON.stringify(userData)
    }) as AuthResponse;

    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }
}

export const apiClient = new ApiClient();