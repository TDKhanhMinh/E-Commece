import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryByAdmin } from "@/service/delivery-service";

export interface DeliveryParams {
    status?: string ;
    startDate?: string | null;
    endDate?: string | null;
    query?: string | null;
    page?: number;
    size?: number;
}

export const useDelivery = ({
    status,
    startDate,
    endDate,
    query,
    page = 0,
    size = 10,
}: DeliveryParams) => {
    return useQuery({
        queryKey: ["deliveries", status, startDate, endDate, query, page, size],
        queryFn: async () => {
            return await getAllDeliveryByAdmin(
                status,
                startDate,
                endDate,
                query,
                page,
                size
            );
        },
    });
};
