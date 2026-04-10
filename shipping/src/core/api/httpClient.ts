import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@constants/app.constants';
import type { ApiResponse } from '@shared/types/common.types';

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.instance = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.instance.defaults.headers.common.Authorization;
    }
  }

  getAuthToken(): string | undefined {
    return this.instance.defaults.headers.common.Authorization as string | undefined;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { headers, params, timeout } = config;

    // Detect FormData to let axios set Content-Type with boundary automatically
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    const axiosConfig: AxiosRequestConfig = {
      method,
      url: endpoint,
      params,
      ...(timeout && { timeout }),
    };

    if (isFormData) {
      console.log('🔵 Detected FormData upload');
      axiosConfig.data = data;
      // CRITICAL: For FormData in React Native, we must NOT set Content-Type
      // React Native's FormData will automatically set the correct multipart header
      // We explicitly override the default Content-Type to prevent conflicts
      axiosConfig.headers = {
        ...headers,
        'Content-Type': 'multipart/form-data', // React Native needs this explicit
      };
      // Don't transform the data - let React Native handle it
      axiosConfig.transformRequest = [(data) => data];
      console.log('🔵 FormData config:', {
        url: axiosConfig.url,
        method: axiosConfig.method,
        headers: axiosConfig.headers,
        hasData: !!axiosConfig.data,
      });
    } else {
      if (data !== undefined) {
        axiosConfig.data = data;
      }
      // Apply custom headers for non-FormData requests
      if (headers) {
        axiosConfig.headers = headers;
      }
    }

    try {
      const response = await this.instance.request(axiosConfig);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            data: null as T,
            error: 'Request timeout',
          };
        }

        return {
          success: false,
          data: null as T,
          error: responseData?.message || `HTTP Error: ${error.response?.status}`,
        };
      }

      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

export const httpClient = new HttpClient();
