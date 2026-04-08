import { StyleSheet, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = StyleSheet.create({
  h1: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  h3: {
    fontFamily,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h5: {
    fontFamily,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  },
  h6: {
    fontFamily,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  body1: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overline: {
    fontFamily,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

export type Typography = typeof typography;
