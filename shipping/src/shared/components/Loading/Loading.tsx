import React, { memo } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@styles/index';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

function LoadingComponent({
  size = 'large',
  color = colors.primary[500],
  text,
  fullScreen = false,
}: LoadingProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  text: {
    ...typography.body2,
    color: colors.text.secondary.light,
    marginTop: spacing.sm,
  },
});

export const Loading = memo(LoadingComponent);
