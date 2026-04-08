import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, { bg: string; text: string }> = {
  default: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
  },
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900',
    text: 'text-primary-700 dark:text-primary-300',
  },
  secondary: {
    bg: 'bg-secondary-100 dark:bg-secondary-900',
    text: 'text-secondary-700 dark:text-secondary-300',
  },
  success: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300',
  },
  warning: {
    bg: 'bg-orange-100 dark:bg-orange-900',
    text: 'text-orange-700 dark:text-orange-300',
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-700 dark:text-red-300',
  },
};

const sizeClasses: Record<BadgeSize, { container: string; text: string }> = {
  sm: { container: 'px-2 py-0.5 rounded', text: 'text-xs' },
  md: { container: 'px-2.5 py-1 rounded-md', text: 'text-sm' },
  lg: { container: 'px-3 py-1.5 rounded-lg', text: 'text-base' },
};

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}: BadgeProps) {
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];

  return (
    <View
      className={`
        flex-row items-center self-start
        ${variantStyle.bg}
        ${sizeStyle.container}
        ${className}
      `}>
      {icon && <View className="mr-1">{icon}</View>}
      <Text className={`font-medium ${variantStyle.text} ${sizeStyle.text}`}>
        {label}
      </Text>
    </View>
  );
}
