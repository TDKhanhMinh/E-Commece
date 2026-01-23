import http from "@/service/http";
import { AxiosResponse } from "axios";

interface LoginResponse {
    accessToken: string;
}
interface LoginRequest {
    email: string;
    password: string;
}
interface RegisterRequest {
    phone: string;
    password: string;
    email: string;
    name: string;
}
interface RegisterResponse {
    id: number;
    phone: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    avatarUrl: string;
    createdAt: string;
}
export const registerApi = async (
    payload: RegisterRequest
): Promise<AxiosResponse<RegisterResponse>> => {
    return http.post<RegisterResponse>("/auth/register", payload);
};
export const login = async (
    payload: LoginRequest
): Promise<AxiosResponse<LoginResponse>> => {
    return http.post<LoginResponse>("/auth/login", payload);
};

export type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse };
