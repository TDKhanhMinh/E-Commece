import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-500 active:bg-primary-600',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-secondary-500 active:bg-secondary-600',
    text: 'text-white',
  },
  outline: {
    container: 'border-2 border-primary-500 bg-transparent active:bg-primary-50',
    text: 'text-primary-500',
  },
  ghost: {
    container: 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800',
    text: 'text-primary-500',
  },
  danger: {
    container: 'bg-error active:bg-error-dark',
    text: 'text-white',
  },
};

const sizeClasses: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: 'px-3 py-1.5 rounded-md',
    text: 'text-sm',
  },
  md: {
    container: 'px-4 py-2.5 rounded-lg',
    text: 'text-base',
  },
  lg: {
    container: 'px-6 py-3.5 rounded-xl',
    text: 'text-lg',
  },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: ButtonProps) {
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`
        flex-row items-center justify-center
        ${sizeStyle.container}
        ${variantStyle.container}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#2196F3' : '#FFFFFF'}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            className={`
              font-semibold
              ${sizeStyle.text}
              ${variantStyle.text}
              ${leftIcon ? 'ml-2' : ''}
              ${rightIcon ? 'mr-2' : ''}
            `}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </Pressable>
  );
}
