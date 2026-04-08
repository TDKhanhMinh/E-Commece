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
    role: string;
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
export type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ChangePasswordRequest,
};
