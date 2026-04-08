import React, { memo, useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableStateCallbackType,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '@styles/index';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const sizeStyles = {
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
};

const textSizeStyles = {
  small: { fontSize: 12 },
  medium: { fontSize: 14 },
  large: { fontSize: 16 },
};

function ButtonComponent({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = useCallback(
    ({ pressed }: PressableStateCallbackType): ViewStyle[] => {
      const baseStyle: ViewStyle[] = [
        styles.base,
        sizeStyles[size],
        styles[variant],
      ];

      if (fullWidth) baseStyle.push(styles.fullWidth);
      if (disabled || loading) baseStyle.push(styles.disabled);
      if (pressed && !disabled && !loading) baseStyle.push(styles.pressed);
      if (style) baseStyle.push(style);

      return baseStyle;
    },
    [variant, size, fullWidth, disabled, loading, style],
  );

  const getTextColor = (): string => {
    if (disabled) return colors.grey[400];
    switch (variant) {
      case 'primary':
        return colors.common.white;
      case 'secondary':
        return colors.common.white;
      case 'outline':
      case 'ghost':
        return colors.primary[500];
      default:
        return colors.common.white;
    }
  };

  return (
    <Pressable
      style={getButtonStyle}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            textSizeStyles[size],
            { color: getTextColor() },
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.secondary[500],
  },
  outline: {
    backgroundColor: colors.common.transparent,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  ghost: {
    backgroundColor: colors.common.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    ...typography.button,
    textTransform: 'none',
  },
});

export const Button = memo(ButtonComponent);
