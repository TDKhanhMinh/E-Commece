import { API_BASE_URL_DEV, API_BASE_URL_PROD } from '@env';

export const APP_NAME = 'Shipping';
export const APP_VERSION = '0.0.1';

export const API_CONFIG = {
  BASE_URL: __DEV__
    ? API_BASE_URL_DEV || 'http://localhost:5000/api'
    : API_BASE_URL_PROD || 'https://api.shipping.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@shipping/auth_token',
  USER_DATA: '@shipping/user_data',
  APP_SETTINGS: '@shipping/app_settings',
  ONBOARDING_COMPLETED: '@shipping/onboarding_completed',
} as const;

export const SCREEN_NAMES = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  MAIN: {
    HOME: 'Home',
    SHIPPING: 'Shipping',
    WALLET: 'Wallet',
    PROFILE: 'Profile',
  },
} as const;
