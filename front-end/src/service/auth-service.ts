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
interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
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
export const changePassword = async (
    changePasswordData: ChangePasswordRequest
): Promise<AxiosResponse<void>> => {
    return http.put<void>("/auth/change-password", { ...changePasswordData });
};
export const forgotPassword = async (
    email: string
): Promise<AxiosResponse<boolean>> => {
    return http.post<boolean>("/auth/forgot-password", null, {
        params: { email: email },
    });
};
export const verifyOtp = async (
    email: string,
    otp: string
): Promise<AxiosResponse<boolean>> => {
    return http.post<boolean>("/auth/verify-otp", null, {
        params: { email: email, otp: otp },
    });
};

export const resetPassword = async (
    email: string,
    newPassword: string
): Promise<AxiosResponse<boolean>> => {
    return http.post<boolean>("/auth/reset-password", null, {
        params: { email: email, newPassword: newPassword },
    });
};

export type {
    LoginRequest,
    RegisterRequest,
    LoginResponse,
    RegisterResponse,
    ChangePasswordRequest,
};
