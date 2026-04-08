import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  otpSchema, 
  type OTPFormData 
} from '@shared/lib/form';
import { Button } from '@shared/components/ui/Button';
import type { AuthStackScreenProps, AuthStackParamList } from '@navigation/types';

type OTPPageRouteProp = RouteProp<AuthStackParamList, 'OTP'>;

export function OTPScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'OTP'>['navigation']>();
  const route = useRoute<OTPPageRouteProp>();
  const { email } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(25);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    setError(null);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onConfirm = () => {
    const otpString = otp.join('');
    const result = otpSchema.safeParse({ otp: otpString });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    // Navigate to Reset Password with a dummy token
    navigation.navigate('ResetPassword', { token: 'dummy-token' });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mt-4 w-10 h-10 items-center justify-center -ml-2"
          >
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mt-6 mb-8">
            <Text className="text-3xl font-bold text-gray-900">Enter OTP</Text>
            <Text className="text-gray-500 mt-2 text-base leading-6">
              Enter the 6-digit OTP code that we sent to{' '}
              <Text className="text-gray-900 font-bold">{email || 'your email'}</Text>
            </Text>
          </View>

          {/* OTP Inputs */}
          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <View 
                key={index} 
                className={`w-[45px] h-[55px] border ${digit ? 'border-success bg-white' : 'border-gray-200 bg-gray-50'} rounded-xl items-center justify-center`}
              >
                <TextInput
                  ref={(ref) => { inputs.current[index] = ref; }}
                  className="text-xl font-bold text-gray-900 text-center w-full h-full"
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  autoFocus={index === 0}
                />
              </View>
            ))}
          </View>

          {error && (
            <Text className="text-error text-sm mb-4 -mt-4">{error}</Text>
          )}

          {/* Timer */}
          <View className="flex-row items-center mb-10">
            <View className="mr-3">
              {/* Simple visual representation of a timer icon/progress */}
              <Icon name="loading" size={20} color="#4CAF50" />
            </View>
            <Text className="text-gray-900 font-semibold">
              00:{timer < 10 ? `0${timer}` : timer}
            </Text>
          </View>

          <View className="flex-1" />

          {/* Confirm Button */}
          <View className="mb-8">
            <Button
              title="Confirm"
              onPress={onConfirm}
              className="bg-success py-4 rounded-xl"
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
