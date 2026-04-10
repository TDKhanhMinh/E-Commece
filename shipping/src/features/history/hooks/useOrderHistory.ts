import { historyService } from '../services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export function useDeliveryDetails(deliveryId: string) {
  return useQuery({
    queryKey: ['delivery-details', deliveryId],
    queryFn: async () => {
      const response = await historyService.getDeliveryDetails(deliveryId);
      console.log('Delivery details response', response.data?.data || response.data);
      if (response.success && response.data) {
        return response.data;
      }
      return response.data;
    },
  });
}

export function useSuccessfulDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deliveryId: string) => {
      const response = await historyService.updateSuccessfulDelivery(deliveryId);
      console.log('Update successful delivery response', response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['delivery-details','all-shipments'] });
    },
    onError: (error) => {
      console.error('Error updating successful delivery', error);
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (fileData: { uri: string; type: string; name: string }) => {
      const response = await historyService.uploadImage(fileData);
      console.log('Upload image API response', response);
      // Usually axios responses have .data, and inside that the backend might have .data
      return response?.data || response;
    },
  });
}

