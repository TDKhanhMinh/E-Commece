import { httpClient } from "@api/httpClient";
import { ApiResponse } from "@shared/types/common.types";

class NotificationService {
    private readonly endpoints = {
        subscribe: '/notifications/subscribe'
    };

    async subscribe(token: string): Promise<ApiResponse<void>> {
        return await httpClient.post<void>(this.endpoints.subscribe, { token });
    }
}

export const notificationService = new NotificationService();