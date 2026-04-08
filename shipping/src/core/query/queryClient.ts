import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  shipments: {
    all: ['shipments'] as const,
    lists: () => [...queryKeys.shipments.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.shipments.lists(), filters] as const,
    details: () => [...queryKeys.shipments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.shipments.details(), id] as const,
    tracking: (trackingNumber: string) =>
      [...queryKeys.shipments.all, 'tracking', trackingNumber] as const,
  },
} as const;
