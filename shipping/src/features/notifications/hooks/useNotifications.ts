import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationService.markReadAll(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error) => {
            console.log('Mark all read error', error);
        },
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
