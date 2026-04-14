import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationService } from "../service/notification.service";

export function useAllNotifications(type: string) {
    return useQuery({
        queryKey: ['notifications', type],
        queryFn: async () => {
            const response = await notificationService.getUserNotifications(type);

            if (response.success && response.data) {
                return response.data.content || [];
            }
            throw new Error(response.error || 'Failed to get notifications');
        },
    });
}

export function useMarkAllRead() {
    return useMutation({
        mutationFn: () => notificationService.markReadAll(),
    });
}

export function useSubscribeNotification() {
    return useMutation({
        mutationFn: async (token: string) => {
            const response = await notificationService.subscribe(token);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to subscribe notification');
        },
    });
}
