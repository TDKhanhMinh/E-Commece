import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import {
  lightTheme,
  darkTheme,
  NavigationLightTheme,
  NavigationDarkTheme,
  type AppTheme,
} from './paperTheme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  theme: AppTheme;
  navigationTheme: typeof NavigationLightTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'system' }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = React.useState<ThemeMode>(initialMode);

  const value = useMemo(() => {
    const isDark =
      mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';

    return {
      mode,
      isDark,
      theme: isDark ? darkTheme : lightTheme,
      navigationTheme: isDark ? NavigationDarkTheme : NavigationLightTheme,
      setMode,
    };
  }, [mode, systemColorScheme]);

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={value.theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeMode() {
  const { mode, setMode, isDark } = useAppTheme();
  return { mode, setMode, isDark };
}
