import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface OnboardingFooterProps {
  onContinue: () => void;
  onSignUp: () => void;
}

export const OnboardingFooter = ({ onContinue, onSignUp }: OnboardingFooterProps) => {
  return (
    <View className="px-8 pb-10 w-full">
      <TouchableOpacity
        onPress={onContinue}
        className="bg-success w-full py-4 rounded-xl active:bg-success-dark mb-3"
      >
        <Text className="text-white text-center font-bold text-lg">Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSignUp}
        className="w-full py-4 rounded-xl border border-gray-200"
      >
        <Text className="text-gray-900 text-center font-bold text-lg">I'm new, sign me up</Text>
      </TouchableOpacity>

      <View className="mt-6">
        <Text className="text-xs text-center text-gray-400 leading-4 px-4">
          By Login or Register, you agree to our{' '}
          <Text className="text-success">Terms of service</Text> and{' '}
          <Text className="text-success">Terms and Privacy and policy.</Text>
        </Text>
      </View>
    </View>
  );
};
