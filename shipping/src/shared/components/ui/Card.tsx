import React from 'react';
import { View, Pressable, ViewProps, PressableProps } from 'react-native';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface BaseCardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
}

interface PressableCardProps extends BaseCardProps, Omit<PressableProps, 'children'> {
  onPress: () => void;
}

interface NonPressableCardProps extends BaseCardProps, ViewProps {
  onPress?: never;
}

type CardProps = PressableCardProps | NonPressableCardProps;

const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-white dark:bg-gray-900 shadow-md',
  outlined: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
  filled: 'bg-gray-100 dark:bg-gray-800',
};

export function Card({
  variant = 'elevated',
  className = '',
  children,
  onPress,
  ...props
}: CardProps) {
  const baseClasses = `rounded-xl p-4 ${variantClasses[variant]} ${className}`;

  if (onPress) {
    return (
      <Pressable
        className={`${baseClasses} active:opacity-90 active:scale-[0.98]`}
        onPress={onPress}
        {...(props as PressableProps)}>
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseClasses} {...(props as ViewProps)}>
      {children}
    </View>
  );
}
