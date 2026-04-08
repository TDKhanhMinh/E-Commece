import React from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { OnboardingStep } from '../types';

interface OnboardingItemProps {
  item: OnboardingStep;
}

export const OnboardingItem = ({ item }: OnboardingItemProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width }} className="flex-1 items-center justify-center p-8">
      <View className="flex-[0.7] justify-center items-center">
        <Image
          source={item.image}
          style={{ width: width * 0.8, height: width * 0.8, resizeMode: 'contain' }}
        />
      </View>

      <View className="flex-[0.3]">
        <Text className="text-2xl font-bold text-gray-900 text-center mb-2 px-4 shadow-sm">
          {item.title}
        </Text>
        <Text className="text-base text-gray-500 text-center px-4 leading-6">
          {item.description}
        </Text>
      </View>
    </View>
  );
};
