export const colors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  secondary: {
    50: '#FCE4EC',
    100: '#F8BBD9',
    200: '#F48FB1',
    300: '#F06292',
    400: '#EC407A',
    500: '#E91E63',
    600: '#D81B60',
    700: '#C2185B',
    800: '#AD1457',
    900: '#880E4F',
  },
  success: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  error: {
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
  background: {
    light: '#FFFFFF',
    dark: '#121212',
  },
  text: {
    primary: {
      light: '#212121',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#757575',
      dark: '#B0B0B0',
    },
    disabled: {
      light: '#9E9E9E',
      dark: '#6E6E6E',
    },
  },
} as const;

export type Colors = typeof colors;
