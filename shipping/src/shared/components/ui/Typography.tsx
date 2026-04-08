import React from 'react';
import { Text, TextProps } from 'react-native';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<TypographyVariant, string> = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
  body1: 'text-base',
  body2: 'text-sm',
  caption: 'text-xs',
  overline: 'text-[10px] uppercase tracking-widest font-medium',
};

export function Typography({
  variant = 'body1',
  className = '',
  children,
  ...props
}: TypographyProps) {
  const baseClasses = variantClasses[variant];

  return (
    <Text
      className={`text-gray-900 dark:text-white ${baseClasses} ${className}`}
      {...props}>
      {children}
    </Text>
  );
}
