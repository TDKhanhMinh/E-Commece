/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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
          DEFAULT: '#2196F3',
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
          DEFAULT: '#E91E63',
        },
        success: {
          light: '#81C784',
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
        },
        warning: {
          light: '#FFB74D',
          DEFAULT: '#FF9800',
          dark: '#F57C00',
        },
        error: {
          light: '#E57373',
          DEFAULT: '#F44336',
          dark: '#D32F2F',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#121212',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};
