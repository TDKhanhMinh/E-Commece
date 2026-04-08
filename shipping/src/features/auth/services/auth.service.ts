import { httpClient } from '@api/httpClient';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@constants/app.constants';
import type { ApiResponse } from '@shared/types/common.types';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthTokens,
} from '../types/auth.types';

interface ApiLoginResponse {
  data: {
    user: User;
    role: User['role'];
    token: string;
  };
  success: boolean;
  message?: string;
  error?: string;
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  role: User['role'];
}

class AuthService {
  private readonly endpoints = {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  };

  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<ApiLoginResponse>(
      this.endpoints.login,
      credentials,
    );
    console.log('Login response in service', response);
    
    if (response.success && response.data) {
      const transformedData = this.transformLoginResponse(response.data);
      console.log('Transformed data in service', transformedData);
      await this.saveAuthData(transformedData);
      return {
        ...response,
        data: transformedData,
      };
    }

    return response as unknown as ApiResponse<LoginResponse>;
  }

  async register(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<ApiLoginResponse>(
      this.endpoints.register,
      data,
    );

    if (response.success && response.data) {
      const transformedData = this.transformLoginResponse(response.data);
      await this.saveAuthData(transformedData);
      return {
        ...response,
        data: transformedData,
      };
    }

    return response as unknown as ApiResponse<LoginResponse>;
  }

  async logout(): Promise<void> {
    await httpClient.post(this.endpoints.logout);
    await this.clearAuthData();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return httpClient.get<User>(this.endpoints.me);
  }

  async refreshToken(): Promise<ApiResponse<AuthTokens>> {
    const tokens = await storage.getItem<AuthTokens>(STORAGE_KEYS.AUTH_TOKEN);

    if (!tokens?.accessToken) {
      return {
        success: false,
        data: null as unknown as AuthTokens,
        error: 'No access token available',
      };
    }

    const response = await httpClient.post<{ token: string }>(
      this.endpoints.refreshToken,
      {
        accessToken: tokens.accessToken,
      }
    );

    if (response.success && response.data) {
      const newTokens: AuthTokens = {
        accessToken: response.data.token as string | undefined,
      } as AuthTokens;
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, newTokens);
      httpClient.setAuthToken(newTokens.accessToken);
      return {
        success: true,
        data: newTokens,
      };
    }

    return response as unknown as ApiResponse<AuthTokens>;
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>(this.endpoints.forgotPassword, {
      email,
    });
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>(this.endpoints.resetPassword, {
      token,
      newPassword,
    });
  }

  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    const tokens = await storage.getItem<AuthTokens>(STORAGE_KEYS.AUTH_TOKEN);

    if (!tokens?.accessToken) {
      return { isAuthenticated: false, user: null };
    }

    httpClient.setAuthToken(tokens.accessToken);

    const response = await this.getCurrentUser();

    if (response.success && response.data) {
      return { isAuthenticated: true, user: response.data };
    }

    const refreshResponse = await this.refreshToken();
    if (refreshResponse.success) {
      const userResponse = await this.getCurrentUser();
      if (userResponse.success && userResponse.data) {
        return { isAuthenticated: true, user: userResponse.data };
      }
    }

    await this.clearAuthData();
    return { isAuthenticated: false, user: null };
  }

  private transformLoginResponse(apiResponse: ApiLoginResponse): LoginResponse {
    console.log('Transforming data in service to LoginResponse', apiResponse);
    return {
      user: apiResponse?.data?.user,
      role: apiResponse?.data?.role,
      tokens: {
        accessToken: apiResponse?.data?.token,
      },
    };
  }

  private async saveAuthData(data: LoginResponse): Promise<void> {
    await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.tokens);
    await storage.setItem(STORAGE_KEYS.USER_DATA, data.user);
    httpClient.setAuthToken(data.tokens.accessToken);
  }

  private async clearAuthData(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storage.removeItem(STORAGE_KEYS.USER_DATA);
    httpClient.setAuthToken(null);
  }
}

export const authService = new AuthService();
