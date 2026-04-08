import http from "@/service/http";
import { PageResponse } from "@/type/api-type";
import { AxiosResponse } from "axios";

export const getAllDeliveryByAdmin: (
    status?: string
) => Promise<AxiosResponse<PageResponse<any>>> = async (
    status?: string
): Promise<AxiosResponse<PageResponse<any>>> => {
    const res = await http.get<PageResponse<any>>("/delivery", {
        params: { status: status || undefined },
    });
    console.log("API Response for getAllDeliveryByAdmin:", res);
    return res;
};
