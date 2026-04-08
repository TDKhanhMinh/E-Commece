import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryByAdmin } from "@/service/delivery-service";

export const useDelivery = (status?: string) => {
    return useQuery({
        queryKey: ["deliveries", status],
        queryFn: async () => {
            return await getAllDeliveryByAdmin(status);
        },
    });
};
