import { Attribute, AttributeRequest } from "@/type/attribute-type";
import http, { ApiResponse } from "@/service/http";

export const getAttributes = async () =>
    http.get<ApiResponse<Attribute[]>>("/attributes");

export const createAttribute = async (data: AttributeRequest) =>
    http.post<ApiResponse<Attribute>>("/attributes", data);

export const updateAttribute = async (id: number, data: AttributeRequest) =>
    http.put<ApiResponse<Attribute>>(`/attributes/${id}`, data);

export const deleteAttribute = async (id: number) =>
    http.delete<ApiResponse<void>>(`/attributes/${id}`);
