import http from "@/service/http";
import {
    ChangePasswordRequest,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from "@/type/auth-type";
import { AxiosResponse } from "axios";

export const registerApi = async (
    payload: RegisterRequest
): Promise<AxiosResponse<RegisterResponse>> => {
    return http.post<RegisterResponse>("/auth/register", payload);
};
export const login = async (
    payload: LoginRequest
): Promise<AxiosResponse<LoginResponse>> => {
    console.log("Biến API URL hiện tại là:", process.env.NEXT_PUBLIC_API_URL);
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
