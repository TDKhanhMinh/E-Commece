import { createStore } from '@store/createStore';
import type { User, AuthTokens } from '../types/auth.types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  role: User['role'] | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setAuthenticated: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
  setRole: (role: User['role'] | null) => void;
  login: (user: User, tokens: AuthTokens, role?: User['role']) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isHydrated: false,
  role: null,
};

export const useAuthStore = createStore<AuthStore>(
  (set, get) => ({
    ...initialState,

    setUser: (user) => set({ user }),

    setTokens: (tokens) => set({ tokens }),

    setAuthenticated: (value) => set({ isAuthenticated: value }),

    setHydrated: (value) => set({ isHydrated: value }),

    setRole: (role) => set({ role }),

    login: (user, tokens, role) =>
      set({
        user,
        tokens,
        role: role || user.role,
        isAuthenticated: true,
      }),

    logout: () =>
      set({
        user: null,
        tokens: null,
        role: null,
        isAuthenticated: false,
      }),

    updateUser: (data) => {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        set({ user: updatedUser, role: data.role || currentUser.role });
      }
    },
  }),
  {
    name: 'auth-store',
    storage: 'async',
    version: 0,
    migrate: (persistedState: any, version: number) => {
      return persistedState as AuthStore;
    },
    onRehydrateStorage: () => (state?: AuthStore) => {
      // Sync the rehydrated token to httpClient
      if (state?.tokens?.accessToken) {
        // Need to import httpClient
        import('@api/httpClient').then(({ httpClient }) => {
          httpClient.setAuthToken(state.tokens!.accessToken);
        });
      }
      state?.setHydrated(true);
    },
  },
);

export const selectUser = () => useAuthStore((state) => state.user);
export const selectIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const selectTokens = () => useAuthStore((state) => state.tokens);
export const selectRole = () => useAuthStore((state) => state.role);
