"use client";

import { useQuery } from "@tanstack/react-query";
import { DeliveryAddress, getDeliveryAddresses } from "@/service/user-service";

/**
 * Hook lấy danh sách địa chỉ giao hàng của user
 */
export const useDeliveryAddresses = () => {
    return useQuery({
        queryKey: ["deliveryAddresses"],
        queryFn: async () => {
            try {
                const response = await getDeliveryAddresses();
                // Http interceptor đã extract data, response là mảng trực tiếp
                const addresses = response as unknown as DeliveryAddress[];
                return addresses || [];
            } catch (error) {
                console.error("Error fetching delivery addresses:", error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5, // 5 phút
        retry: 1,
    });
};

/**
 * Hook lấy địa chỉ mặc định
 */
export const useDefaultDeliveryAddress = () => {
    const { data: addresses, isLoading, error } = useDeliveryAddresses();

    // Đảm bảo addresses luôn là array
    const addressList = addresses || [];
    const defaultAddress =
        addressList.find((addr) => addr.isDefault) || addressList[0];

    return {
        defaultAddress: defaultAddress || null,
        addresses: addressList,
        isLoading,
        error,
        hasAddresses: addressList.length > 0,
    };
};
