import React from 'react';
import { View, Animated, useWindowDimensions } from 'react-native';

interface PaginatorProps {
  data: any[];
  scrollX: Animated.Value;
}

export const Paginator = ({ data, scrollX }: PaginatorProps) => {
  const { width } = useWindowDimensions();

  return (
    <View className="flex-row h-16 items-center justify-center">
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={{
              width: dotWidth,
              opacity,
            }}
            className="h-2 rounded-full bg-success mx-1"
          />
        );
      })}
    </View>
  );
};
