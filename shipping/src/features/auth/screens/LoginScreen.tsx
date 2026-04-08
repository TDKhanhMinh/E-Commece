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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useFormWithSchema,
  loginSchema,
  type LoginFormData,
  Controller,
} from '@shared/lib/form';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import type { AuthStackScreenProps } from '@navigation/types';

export function LoginScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Login'>['navigation']>();
  const { login, isLoggingIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormWithSchema<LoginFormData>({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login failed:', error);
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
          showsVerticalScrollIndicator={false}
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
            <Text className="text-3xl font-bold text-gray-900">Login</Text>
            <Text className="text-gray-500 mt-2 text-base">
              Enter your email and password to log in.
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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="james123"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              className="items-end mb-8"
            >
              <Text className="text-success font-semibold">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              loading={isLoggingIn}
              className="bg-success py-4 rounded-xl"
              size="lg"
            />

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-4 text-gray-400 text-sm">Or, Login with</Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            {/* Social Buttons */}
            <View className="gap-y-4">
              <TouchableOpacity
                className="flex-row items-center justify-center border border-gray-200 py-4 rounded-full bg-white shadow-sm"
              >
                <Icon name="google" size={24} color="#DB4437" />
                <Text className="ml-3 font-bold text-gray-800 text-lg">Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center border border-gray-200 py-4 rounded-full bg-white shadow-sm"
              >
                <Icon name="facebook" size={24} color="#4267B2" />
                <Text className="ml-3 font-bold text-gray-800 text-lg">Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center items-center mt-12 mb-8">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="text-success font-bold">Register.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
