import { httpClient } from "@api/httpClient";
import { ApiResponse } from "@shared/types/common.types";
import { NotificationPage } from "../types/notifications.types";

class NotificationService {
    private readonly endpoints = {
        subscribe: '/notifications/subscribe',
        getUserNotifications: '/notifications',
        readAll: '/notifications/mark-all-read'
    };

    async subscribe(token: string): Promise<ApiResponse<void>> {
        return await httpClient.post<void>(this.endpoints.subscribe, { token });
    }

    async getUserNotifications(type: string): Promise<ApiResponse<NotificationPage>> {
        const response = await httpClient.get<any>(this.endpoints.getUserNotifications, {
            params: { type: type.toUpperCase() }
        });
        return {
            ...response,
            data: response.data?.data
        };
    }

    async markReadAll(): Promise<ApiResponse<void>> {
        return await httpClient.post<void>(this.endpoints.readAll);
    }
}

export const notificationService = new NotificationService();