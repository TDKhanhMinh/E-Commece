import React, { ReactNode } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { colors } from '@styles/colors';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

interface NavigationProviderProps {
  children: ReactNode;
}

const LightNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[500],
    background: colors.background.light,
    card: colors.common.white,
    text: colors.text.primary.light,
    border: colors.grey[300],
    notification: colors.error.main,
  },
};

const DarkNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary[400],
    background: colors.background.dark,
    card: colors.grey[900],
    text: colors.text.primary.dark,
    border: colors.grey[700],
    notification: colors.error.light,
  },
};

export function NavigationProvider({ children }: NavigationProviderProps) {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? DarkNavigationTheme : LightNavigationTheme;

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      {children}
    </NavigationContainer>
  );
}
