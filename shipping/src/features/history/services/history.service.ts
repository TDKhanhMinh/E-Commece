import { httpClient } from '@/core';
import type { ReportIssueData } from '../types';
import { ApiResponse } from '@/shared';
import { API_CONFIG } from '@/shared/constants/app.constants';

class HistoryService {
  private readonly endpoints = {
    deliveryDetails: '/delivery',
    images: '/images/upload',
  };

  async getDeliveryDetails(deliveryId: string): Promise<ApiResponse<any>> {
    return await httpClient.get(`${this.endpoints.deliveryDetails}/${deliveryId}`);
  }
  async reportIssue(data: ReportIssueData): Promise<ApiResponse<any>> {
    return await httpClient.post('/issues/report', data);
  }
  async updateSuccessfulDelivery(deliveryId: string): Promise<ApiResponse<any>> {
    return await httpClient.post(`/delivery/${deliveryId}/success`);
  }

  async uploadImage(fileData: { uri: string; type: string; name: string }): Promise<any> {
    const formData = new FormData();

    // React Native requires this specific format for file uploads
    formData.append('file', {
      uri: fileData.uri,
      type: fileData.type,
      name: fileData.name,
    } as any);

    console.log('📤 Uploading with native fetch API');
    console.log('File data:', fileData);

    // Get auth token from httpClient
    const authHeader = httpClient.getAuthToken();

    // Use native fetch for file upload (more reliable in React Native)
    try {
      const headers: Record<string, string> = {};
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
      // Don't set Content-Type - let React Native set it with boundary

      const response = await fetch(`${API_CONFIG.BASE_URL}${this.endpoints.images}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('📥 Upload status:', response.status, response.statusText);
      const result = await response.json();
      console.log('📥 Upload response:', result);

      if (response.ok) {
        return {
          success: true,
          data: result,
        };
      } else {
        return {
          success: false,
          data: null,
          error: result.message || 'Upload failed',
        };
      }
    } catch (error) {
      console.error(' Upload error:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

}
export const historyService = new HistoryService();

