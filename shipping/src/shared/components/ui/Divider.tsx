import React from 'react';
import { View, Text } from 'react-native';

interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({
  label,
  orientation = 'horizontal',
  className = '',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <View className={`w-px bg-gray-200 dark:bg-gray-700 ${className}`} />
    );
  }

  if (label) {
    return (
      <View className={`flex-row items-center my-4 ${className}`}>
        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <Text className="mx-4 text-sm text-gray-500 dark:text-gray-400">
          {label}
        </Text>
        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </View>
    );
  }

  return (
    <View
      className={`h-px bg-gray-200 dark:bg-gray-700 my-4 ${className}`}
    />
  );
}
