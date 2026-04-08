import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { queryKeys } from '@core/query';
import { shippingService } from '../services/shipping.service';
import type {
  Shipment,
  ShipmentFilters,
  CreateShipmentData,
} from '../types/shipping.types';

const ITEMS_PER_PAGE = 10;

export function useShipments(filters?: ShipmentFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.shipments.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await shippingService.getShipments(
        filters,
        pageParam,
        ITEMS_PER_PAGE,
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch shipments');
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useShipment(shipmentId: string) {
  return useQuery({
    queryKey: queryKeys.shipments.detail(shipmentId),
    queryFn: async () => {
      const response = await shippingService.getShipmentById(shipmentId);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch shipment');
    },
    enabled: !!shipmentId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrackShipment(trackingNumber: string) {
  return useQuery({
    queryKey: queryKeys.shipments.tracking(trackingNumber),
    queryFn: async () => {
      const response = await shippingService.getShipmentByTrackingNumber(trackingNumber);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Shipment not found');
    },
    enabled: !!trackingNumber,
    staleTime: 1000 * 60,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateShipmentData) => {
      const response = await shippingService.createShipment(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to create shipment');
    },
    onSuccess: (newShipment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.lists() });
      queryClient.setQueryData(
        queryKeys.shipments.detail(newShipment.id),
        newShipment,
      );
    },
  });
}

export function useCancelShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await shippingService.cancelShipment(id, reason);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to cancel shipment');
    },
    onSuccess: (updatedShipment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.lists() });
      queryClient.setQueryData(
        queryKeys.shipments.detail(updatedShipment.id),
        updatedShipment,
      );
    },
  });
}

export function useEstimateShippingFee() {
  return useMutation({
    mutationFn: async ({
      senderAddress,
      receiverAddress,
      totalWeight,
      insuranceRequired = false,
      declaredValue = 0,
    }: {
      senderAddress: { city: string; district: string };
      receiverAddress: { city: string; district: string };
      totalWeight: number;
      insuranceRequired?: boolean;
      declaredValue?: number;
    }) => {
      const response = await shippingService.estimateShippingFee(
        senderAddress,
        receiverAddress,
        totalWeight,
        insuranceRequired,
        declaredValue,
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to estimate shipping fee');
    },
  });
}

export function usePrefetchShipment() {
  const queryClient = useQueryClient();

  return (shipmentId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.shipments.detail(shipmentId),
      queryFn: async () => {
        const response = await shippingService.getShipmentById(shipmentId);
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to fetch shipment');
      },
      staleTime: 1000 * 60 * 5,
    });
  };
}
