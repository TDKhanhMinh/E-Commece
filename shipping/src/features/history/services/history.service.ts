import { httpClient } from '@/core';
import type { ReportIssueData } from '../types';
import { ApiResponse } from '@/shared';
import { API_CONFIG } from '@/shared/constants/app.constants';
import ReactNativeBlobUtil from 'react-native-blob-util';
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
  async updateSuccessfulDelivery(deliveryId: string, proofImage: string): Promise<ApiResponse<any>> {
    return await httpClient.post(`/delivery/${deliveryId}/success`, { proofImage });
  }

  async uploadImage(fileData: { uri: string; type: string; name: string }): Promise<any> {
    console.log('📤 Uploading with React Native Blob Util');
    console.log('Original URI:', fileData.uri);

    const realPath = fileData.uri.replace(/^file:\/\//i, '');

    const authHeader = httpClient.getAuthToken();

    try {
      const response = await ReactNativeBlobUtil.fetch(
        'POST',
        `${API_CONFIG.BASE_URL}${this.endpoints.images}`,
        {
          Authorization: authHeader || '',
          'Content-Type': 'multipart/form-data',
        },
        [
          // Định nghĩa FormData ở dạng mảng object
          {
            name: 'file', // Tên field phải khớp với tham số của Spring Boot
            filename: fileData.name || `proof_${Date.now()}.jpg`,
            type: fileData.type || 'image/jpeg',
            // Hàm wrap() này là "phép thuật" giúp đọc file an toàn không bị sập
            data: ReactNativeBlobUtil.wrap(realPath)
          }
        ]
      );

      console.log('📥 Upload status:', response.info().status);

      // Parse data từ chuỗi String sang JSON
      const resultData = JSON.parse(response.data);
      console.log('📥 Upload response:', resultData);

      const status = response.info().status;
      if (status >= 200 && status < 300) {
        return {
          success: true,
          data: resultData,
        };
      } else {
        return {
          success: false,
          data: null,
          error: resultData.message || 'Upload failed with status ' + status,
        };
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown native error',
      };
    }
  }
}
export const historyService = new HistoryService();

