import React, { memo, ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors, spacing, borderRadius } from '@styles/index';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: keyof typeof spacing;
}

function CardComponent({
  children,
  style,
  onPress,
  elevation = 'low',
  padding = 'md',
}: CardProps) {
  const cardStyle: ViewStyle[] = [
    styles.card,
    styles[elevation],
    { padding: spacing[padding] },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
        onPress={onPress}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  none: {
    elevation: 0,
    shadowOpacity: 0,
  },
  low: {
    elevation: 2,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medium: {
    elevation: 4,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  high: {
    elevation: 8,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

export const Card = memo(CardComponent);
