import type { BaseEntity, Nullable } from '@shared/types/common.types';

export interface User extends BaseEntity {
  email: string;
  phone: string;
  name: string;
  avatarUrl: Nullable<string>;
  role: 'ADMIN' | 'USER' | 'DRIVER';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn?: number;
}

export type AuthState = {
  user: Nullable<User>;
  tokens: Nullable<AuthTokens>;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: Nullable<User['role']>;
};
