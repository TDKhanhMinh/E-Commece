import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@core/query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginCredentials, RegisterData, User } from '../types/auth.types';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore();

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to get user');
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authService.login(credentials);
      console.log('Login response in hook', response.data);
        return response;
    },
    onSuccess: (data) => {
      console.log('Login success', data);
      storeLogin(data?.data?.user, data?.data?.tokens, data?.data?.role);
      queryClient.setQueryData(queryKeys.auth.user(), data?.data?.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await authService.register(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Registration failed');
    },
    onSuccess: (data) => {
      storeLogin(data.user, data.tokens, data.role);
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      storeLogout();
      queryClient.clear();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to send reset email');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      const response = await authService.resetPassword(token, newPassword);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to reset password');
    },
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading: isLoadingUser,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error?.message,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error?.message,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingResetEmail: forgotPasswordMutation.isPending,

    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
  };
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to get user');
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}
