import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export interface ApiResponse<T = any> {
    statusCode: number;
    message: string;
    data: T;
    errors?: Record<string, string>;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
export class ApiError extends Error {
    statusCode: number;
    errors?: Record<string, string>;

    constructor(
        message: string,
        statusCode: number,
        errors?: Record<string, string>
    ) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
});

http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;
        if (token && typeof token === "string") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
http.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const apiResponse = response.data;

        if (apiResponse.statusCode && apiResponse.statusCode !== 200) {
            throw new ApiError(
                apiResponse.message || "Lỗi nghiệp vụ",
                apiResponse.statusCode,
                apiResponse.errors
            );
        }

        return apiResponse.data;
    },

    (error: AxiosError<ApiResponse>) => {
        const statusCode = error.response?.status ?? 500;
        const data = error.response?.data;

        const message =
            data?.message ||
            (statusCode === 400 && "Dữ liệu không hợp lệ") ||
            (statusCode === 401 && "Bạn chưa đăng nhập") ||
            (statusCode === 403 && "Bạn không có quyền") ||
            (statusCode === 404 && "Không tìm thấy tài nguyên") ||
            "Lỗi hệ thống";

        if (statusCode === 401) {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(new ApiError(message, statusCode, data?.errors));
    }
);

// http.interceptors.response.use(
//     (response: AxiosResponse<ApiResponse>) => {
//         const apiResponse = response.data;
//
//         if (apiResponse.statusCode && apiResponse.statusCode !== 200) {
//             throw new ApiError(
//                 apiResponse.message || "Lỗi nghiệp vụ không xác định",
//                 apiResponse.statusCode
//             );
//         }
//
//         return apiResponse.data as any;
//     },
//     (error: AxiosError<ApiResponse>) => {
//         const status = error?.status || 500;
//
//         const serverMessage = error.message || "Lỗi hệ thống";
//
//         if (status === 401) {
//             localStorage.removeItem("token");
//             window.dispatchEvent(new Event("auth:logout"));
//         }
//
//         return Promise.reject(new ApiError(serverMessage, status));
//     }
// );

export default http;
