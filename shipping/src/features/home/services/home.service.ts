import { ApiResponse } from "@/shared";
import { httpClient } from "@api/httpClient";

export interface SpringPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;   // current page (0-based)
    size: number;
    last: boolean;
    first: boolean;
    empty: boolean;
}

class HomeService {
    private readonly endpoints = {
        unsignDelivery: '/delivery/unassigned',
    };

    async unsignDelivery(page = 0, size = 10): Promise<ApiResponse<SpringPage<any>>> {
        return await httpClient.get(this.endpoints.unsignDelivery, {
            params: { page, size },
        });
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