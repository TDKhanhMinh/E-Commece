import { AxiosResponse } from "axios";
import http from "@/service/http";
import {
    AddDeliveryAddress,
    DeliveryAddress,
    UserProfile,
    UserRequest,
} from "@/type/user-type";
import { PageResponse } from "@/type/api-type";

export const getProfile: () => Promise<
    AxiosResponse<UserProfile>
> = async (): Promise<AxiosResponse<UserProfile>> => {
    return http.get<UserProfile>("/user/profile");
};
export const updateProfile: (
    data: UserRequest
) => Promise<AxiosResponse<UserProfile>> = async (
    data: UserRequest
): Promise<AxiosResponse<UserProfile>> => {
    return http.put<UserProfile>("/user/profile", data);
};

export const getAllUsers: (
    page: number,
    size: number,
    sortBy?: string,
    sortDir?: string,
    searchQuery?: string
) => Promise<AxiosResponse<PageResponse<any>>> = async (
    page,
    size,
    sortBy,
    sortDir,
    searchQuery
): Promise<AxiosResponse<PageResponse<any>>> => {
    return http.get<PageResponse<any>>("/user/all", {
        params: { page, size, sortBy, sortDir, searchQuery },
    });
};
export const getDeliveryAddresses: () => Promise<
    AxiosResponse<DeliveryAddress[]>
> = async (): Promise<AxiosResponse<DeliveryAddress[]>> => {
    return http.get<DeliveryAddress[]>("/user/delivery-addresses");
};

export const addDeliveryAddress: (
    data: AddDeliveryAddress
) => Promise<AxiosResponse<DeliveryAddress>> = async (
    data: AddDeliveryAddress
): Promise<AxiosResponse<DeliveryAddress>> => {
    return http.post<DeliveryAddress>("/user/delivery-addresses", data);
};

export const deleteUser: (id: number) => Promise<AxiosResponse<any>> = async (
    id: number
): Promise<AxiosResponse<any>> => {
    return http.delete<AxiosResponse<any>>(`/user/${id}`);
};
export const deleteDeliveryAddress: (
    id: number
) => Promise<AxiosResponse<void>> = async (
    id: number
): Promise<AxiosResponse<void>> => {
    return http.delete<void>(`/user/delivery-addresses/${id}`);
};
export const updateDeliveryAddress: (
    id: number,
    data: AddDeliveryAddress
) => Promise<AxiosResponse<DeliveryAddress>> = async (
    id: number,
    data: AddDeliveryAddress
): Promise<AxiosResponse<DeliveryAddress>> => {
    return http.put<DeliveryAddress>(`/user/delivery-addresses/${id}`, data);
};
export type { UserProfile, UserRequest, DeliveryAddress };
