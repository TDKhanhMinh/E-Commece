import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAppStore } from '@core/store/useAppStore';
import { OnboardingItem } from '../components/OnboardingItem';
import { Paginator } from '../components/Paginator';
import { OnboardingFooter } from '../components/OnboardingFooter';
import { OnboardingStep } from '../types';

const slides: OnboardingStep[] = [
  {
    id: '1',
    title: 'Goods delivery is now easier',
    description: 'Now, managing goods delivery has become simpler than ever.',
    image: require('@assets/images/onboarding_delivery.png'),
  },
  {
    id: '2',
    title: 'Package tracking is safer',
    description: 'Tracking your package ensures a safer delivery experience.',
    image: require('@assets/images/onboarding_tracking.png'),
  },
  {
    id: '3',
    title: 'Use points for shipping deals',
    description: 'Consider utilizing points to unlock exclusive shipping deals.',
    image: require('@assets/images/onboarding_rewards.png'),
  },
];

export const OnboardingScreen = () => {
  const setOnboarded = useAppStore((state) => state.setOnboarded);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleContinue = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      setOnboarded(true);
    }
  };

  const handleSignUp = () => {
    setOnboarded(true);
    // Navigation to Sign Up logic can be added here or handled by RootNavigator reaction
  };

  const handleSkip = () => {
    setOnboarded(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-8 py-4">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-success rounded-lg items-center justify-center mr-2">
            <Text className="text-white font-bold text-xs">S</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">Shipro</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-success font-semibold">Skip</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-[3]">
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <Paginator data={slides} scrollX={scrollX} />
      
      <OnboardingFooter 
        onContinue={handleContinue} 
        onSignUp={handleSignUp} 
      />
    </SafeAreaView>
  );
};
