import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (token, user) =>
                set({
                    token,
                    user,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
