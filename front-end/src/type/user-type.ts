interface UserProfile {
    id: number;
    name: string;
    phone: string;
    email: string;
    avatarUrl: string;
    role: string;
}
interface UserRequest {
    name?: string | undefined;
    phone?: string | undefined;
}
interface DeliveryAddress {
    id: number;
    location: string;
    userName: string;
    phoneNumber: string;
    isDefault: boolean;
}
interface AddDeliveryAddress {
    location: string;
    userName: string;
    phoneNumber: string;
}
interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    avatarUrl?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
}
interface AddressCardProps {
    id: number;
    name: string;
    address: string;
    phone: string;
    isDefault: boolean;
}

export type {
    UserProfile,
    UserRequest,
    DeliveryAddress,
    AddDeliveryAddress,
    User,
    AuthState,
    AddressCardProps,
};
