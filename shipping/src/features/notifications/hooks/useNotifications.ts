import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../service/notification.service";
import type { NotificationPage } from "../types/notifications.types";

const PAGE_SIZE = 10;

export function useAllNotifications(type: string) {
    return useInfiniteQuery({
        queryKey: ['notifications', type],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await notificationService.getUserNotifications(type, pageParam as number, PAGE_SIZE);
            if (response.success && response.data) {
                // Ensure we always return a valid page structure
                const page = response.data;
                return {
                    content: page.content ?? [],
                    totalElements: page.totalElements ?? 0,
                    totalPages: page.totalPages ?? 1,
                    number: page.number ?? (pageParam as number),
                    size: page.size ?? PAGE_SIZE,
                    first: page.first ?? (pageParam === 0),
                    last: page.last ?? true,
                    empty: page.empty ?? (page.content?.length === 0),
                } as NotificationPage;
            }
            throw new Error(response.error || 'Failed to get notifications');
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.last) return undefined;
            return lastPage.number + 1;
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
