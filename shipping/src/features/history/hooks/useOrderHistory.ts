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
    mutationFn: async ({ deliveryId, proofImage }: { deliveryId: string, proofImage: string }) => {
      console.log('Delivery ID', deliveryId);
      console.log('Proof image', proofImage);

      const response = await historyService.updateSuccessfulDelivery(deliveryId, proofImage);
      console.log('Update successful delivery response', response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-details', 'all-shipments'] });
    },
    onError: (error) => {
      console.error('Error updating successful delivery', error);
    },
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fileData: { uri: string; type: string; name: string }) => {
      const response = await historyService.uploadImage(fileData);
      console.log('Upload image API response', response);
      return response?.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-details', 'all-shipments'] });
    },
  });
}

