import { ApiResponse, PaginatedResponse } from "@/shared";
import { httpClient } from "@api/httpClient";

class HomeService {
    private readonly endpoints = {
        unsignDelivery: '/delivery/unassigned',
    };

    async unsignDelivery(): Promise<ApiResponse<PaginatedResponse<any>>> {
        return await httpClient.get(this.endpoints.unsignDelivery);
    }

    async acceptOrder(deliveryId: string): Promise<ApiResponse<any>> {
        return await httpClient.post(`/delivery/${deliveryId}/accept`);
    }

    async deliveryOrder(deliveryId: string): Promise<ApiResponse<any>> {
        return await httpClient.post(`/delivery/${deliveryId}/delivery`);
    }

    async cancelOrder(deliveryId: string): Promise<ApiResponse<any>> {
        return await httpClient.post(`/delivery/${deliveryId}/cancel`);
    }
}

export const homeService = new HomeService();