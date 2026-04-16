import http from "@/service/http";
import { PageResponse } from "@/type/api-type";
import { AxiosResponse } from "axios";

export const getAllDeliveryByAdmin: (
    status?: string,
    startDate?: string | null,
    endDate?: string | null,
    query?: string | null,
    page?: number,
    size?: number
) => Promise<AxiosResponse<PageResponse<any>>> = async (
    status?: string,
    startDate?: string | null,
    endDate?: string | null,
    query?: string | null,
    page: number = 0,
    size: number = 10
): Promise<AxiosResponse<PageResponse<any>>> => {
    const res = await http.get<PageResponse<any>>("/delivery", {
        params: {
            status: status || undefined,
            startDate: startDate || null,
            endDate: endDate || null,
            query: query || null,
            page,
            size,
        },
    });
    console.log("API Response for getAllDeliveryByAdmin:", res);
    return res;
};
