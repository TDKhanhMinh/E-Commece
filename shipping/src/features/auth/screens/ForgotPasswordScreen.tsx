import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../hooks/useAuth';
import {
  useFormWithSchema,
  forgotPasswordSchema,
  type ForgotPasswordFormData,
  Controller,
} from '@shared/lib/form';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import type { AuthStackScreenProps } from '@navigation/types';

export function ForgotPasswordScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'ForgotPassword'>['navigation']>();
  const theme = useTheme();
  const { forgotPassword, isSendingResetEmail } = useAuth();

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormWithSchema<ForgotPasswordFormData>({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setSnackbar({
        visible: true,
        message: 'Mã xác thực đã được gửi đến email của bạn',
        type: 'success'
      });
      // Delay navigation slightly to let user see the message
      setTimeout(() => {
        navigation.navigate('OTP', { email: data.email });
      }, 1500);
    } catch (error) {
      setSnackbar({
        visible: true,
        message: 'Không thể gửi mã xác thực. Vui lòng thử lại.',
        type: 'error'
      });
    }
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
            <Text className="text-3xl font-bold text-gray-900">Forgot Password?</Text>
            <Text className="text-gray-500 mt-2 text-base">
              If you've forgotten your password, please enter your email to reset it.
            </Text>
          </View>

          {/* Form */}
          <View className="flex-1">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="jamesbon@gmail.com"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <View className="mt-8">
              <Button
                title="Confirm"
                onPress={handleSubmit(onSubmit)}
                loading={isSendingResetEmail}
                className="bg-success py-4 rounded-xl"
                size="lg"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
        duration={3000}
        style={{
          backgroundColor: snackbar.type === 'success' ? '#4CAF50' : '#F44336',
        }}
        action={{
          label: 'OK',
          onPress: () => setSnackbar(prev => ({ ...prev, visible: false })),
          textColor: '#fff'
        }}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  );
}
