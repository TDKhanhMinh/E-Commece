import { View, Text, Image, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingStep } from '../types';

interface OnboardingItemProps {
  item: OnboardingStep;
}

export const OnboardingItem = ({ item }: OnboardingItemProps) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-1 items-center justify-center p-8"
      style={{ 
        width,
        paddingLeft: Math.max(insets.left, 32), 
        paddingRight: Math.max(insets.right, 32) 
      }}
    >
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
