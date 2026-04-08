import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '@styles/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  error: string;
  success: string;
  warning: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: colors.background.light,
  surface: colors.common.white,
  primary: colors.primary[500],
  secondary: colors.secondary[500],
  text: {
    primary: colors.text.primary.light,
    secondary: colors.text.secondary.light,
    disabled: colors.text.disabled.light,
  },
  border: colors.grey[300],
  error: colors.error.main,
  success: colors.success.main,
  warning: colors.warning.main,
};

const darkColors: ThemeColors = {
  background: colors.background.dark,
  surface: colors.grey[900],
  primary: colors.primary[400],
  secondary: colors.secondary[400],
  text: {
    primary: colors.text.primary.dark,
    secondary: colors.text.secondary.dark,
    disabled: colors.text.disabled.dark,
  },
  border: colors.grey[700],
  error: colors.error.light,
  success: colors.success.light,
  warning: colors.warning.light,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  mode?: ThemeMode;
}

export function ThemeProvider({ children, mode = 'system' }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();

  const value = useMemo(() => {
    const isDark =
      mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';

    return {
      mode,
      isDark,
      colors: isDark ? darkColors : lightColors,
    };
  }, [mode, systemColorScheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
