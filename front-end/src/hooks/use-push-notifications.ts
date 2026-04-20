"use client"

import { useState, useEffect } from 'react';
import { setupFCMListener } from '@/lib/firebase';
import { toast } from 'sonner';
import { NotificationService } from '@/service/notification-service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const usePushNotifications = () => {
    const [token, setToken] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermissionStatus(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            toast.error('This browser does not support desktop notification');
            return;
        }

        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);

        if (permission === 'granted') {
            try {
                const currentToken = await NotificationService.registerDevice();
                if (currentToken) {
                    setToken(currentToken);
                    toast.success('Notifications enabled and registered successfully!');
                } else {
                    toast.error('Failed to generate notification token.');
                }
            } catch (error) {
                console.error('Failed to register device token with backend:', error);
                toast.error('Registered with Firebase but failed to sync with server.');
            }
        } else {
            toast.error('Notification permission denied.');
        }
    };

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        
        if (permissionStatus === 'granted') {    
            setupFCMListener((payload) => {
                if (payload) {
                    toast.info(payload?.notification?.title || 'New Notification', {
                        description: payload?.notification?.body,
                    });
                }
            }).then(unsubFunc => {
                if (unsubFunc) {
                    // Check if component is still mounted before assigning
                    unsubscribe = unsubFunc;
                }
            }).catch(err => console.error("FCM Listener error:", err));
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [permissionStatus]);

    return { token, permissionStatus, requestPermission };
};

export const useNotificationsQuery = (page = 0, size = 20, type = "ALL") => {
    return useQuery({
        queryKey: ['notifications', page, size, type],
        queryFn: async () => {
            const response: any = await NotificationService.getNotifications({ page, size, type });
            return response?.content || response?.data?.content || response?.data || response || [];
        }
    });
};

export const useMarkAllAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => NotificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });
};
