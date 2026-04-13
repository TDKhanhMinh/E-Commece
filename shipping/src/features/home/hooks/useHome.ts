import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { homeService } from "../services/home.service";

export function useUnsignDelivery() {
    return useQuery({
        queryKey: ['home', 'unsign-delivery'],
        queryFn: async () => {
            const response = await homeService.unsignDelivery();
            console.log('Unsign delivery response', response);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to get unsign delivery');
        },
    });
}

export function useAcceptOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deliveryId: string) => {
            const response = await homeService.acceptOrder(deliveryId);
            console.log('Accept order response', response);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to accept order');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home', 'unsign-delivery', 'all-shipments'] });
        },
        onError: (error) => {
            console.log('Accept order error', error);
        },
    });
}




export function useDeliveryOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deliveryId: string) => {
            const response = await homeService.deliveryOrder(deliveryId);
            console.log('Delivery order response', response);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to delivery order');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home', 'unsign-delivery', 'all-shipments'] });
        },
        onError: (error) => {
            console.log('Delivery order error', error);
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deliveryId: string) => {
            const response = await homeService.cancelOrder(deliveryId);
            console.log('Cancel order response', response);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to cancel order');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home', 'unsign-delivery', 'all-shipments'] });
        },
        onError: (error) => {
            console.log('Cancel order error', error);
        },
    });
}