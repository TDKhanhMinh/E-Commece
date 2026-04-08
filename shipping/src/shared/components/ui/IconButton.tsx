import React from 'react';
import { Pressable, PressableProps, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type IconButtonVariant = 'default' | 'primary' | 'outlined' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const variantClasses: Record<IconButtonVariant, { bg: string; iconColor: string }> = {
  default: {
    bg: 'bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
    iconColor: '#424242',
  },
  primary: {
    bg: 'bg-primary-500 active:bg-primary-600',
    iconColor: '#FFFFFF',
  },
  outlined: {
    bg: 'border border-gray-300 dark:border-gray-600 active:bg-gray-100 dark:active:bg-gray-800',
    iconColor: '#424242',
  },
  ghost: {
    bg: 'active:bg-gray-100 dark:active:bg-gray-800',
    iconColor: '#424242',
  },
};

const sizeClasses: Record<IconButtonSize, { container: string; iconSize: number }> = {
  sm: { container: 'w-8 h-8 rounded-md', iconSize: 18 },
  md: { container: 'w-10 h-10 rounded-lg', iconSize: 22 },
  lg: { container: 'w-12 h-12 rounded-xl', iconSize: 26 },
};

export function IconButton({
  icon,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}: IconButtonProps) {
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`
        items-center justify-center
        ${sizeStyle.container}
        ${variantStyle.bg}
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}>
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.iconColor} />
      ) : (
        <Icon name={icon} size={sizeStyle.iconSize} color={variantStyle.iconColor} />
      )}
    </Pressable>
  );
}
