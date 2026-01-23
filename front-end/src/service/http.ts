import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

export interface ApiResponse<T = any> {
    statusCode: number;
    message: string;
    data: T;
}

export class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
    }
}

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
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
                apiResponse.message || "Lỗi nghiệp vụ không xác định",
                apiResponse.statusCode
            );
        }

        return apiResponse.data as any;
    },
    (error: AxiosError<ApiResponse>) => {
        const status = error.response?.status || 500;

        const serverMessage =
            error.response?.data?.message || error.message || "Lỗi hệ thống";

        if (status === 401) {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(new ApiError(serverMessage, status));
    }
);

export default http;
