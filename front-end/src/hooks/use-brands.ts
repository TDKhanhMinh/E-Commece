"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/service/brand-service";

export const useBrands = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: async () => {
            const response = await getBrands();
            return response.data.data; // Trả về mảng Brand[]
        },
        // Thương hiệu ít khi thay đổi, nên cache lâu một chút (5 phút)
        staleTime: 1000 * 60 * 5,
        // Nếu API lỗi, không retry quá nhiều lần tránh spam
        retry: 1,
    });
};
