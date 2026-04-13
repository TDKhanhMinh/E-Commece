import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryByAdmin } from "@/service/delivery-service";

export const useDelivery = (status?: string, page: number = 0, size: number = 10) => {
    return useQuery({
        queryKey: ["deliveries", status, page, size],
        queryFn: async () => {
            return await getAllDeliveryByAdmin(status, page, size);
        },
    });
};
