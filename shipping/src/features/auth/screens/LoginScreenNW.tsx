import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Box,
  Typography,
  Button as NWButton,
  Input as NWInput,
  Card,
  Divider,
} from '@components/ui';
import { useFormWithSchema, loginSchema, type LoginFormData } from '@shared/lib/form';
import { Controller } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

export function LoginScreenNW() {
  const insets = useSafeAreaInsets();
  const { login, isLoggingIn, loginError } = useAuth();
  const [showError, setShowError] = useState(false);

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
    } catch {
      setShowError(true);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-gray-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
        className="px-6">
        {/* Logo & Header */}
        <Box className="items-center mb-8">
          <View className="w-20 h-20 bg-primary-500 rounded-2xl items-center justify-center mb-4 shadow-lg">
            <Icon name="truck-delivery" size={40} color="#FFFFFF" />
          </View>
          <Typography variant="h2" className="text-center">
            Welcome Back
          </Typography>
          <Typography variant="body1" className="text-gray-500 dark:text-gray-400 text-center mt-2">
            Sign in to manage your shipments
          </Typography>
        </Box>

        {/* Login Form */}
        <Card variant="outlined" className="mb-6">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <NWInput
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="email-outline"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <NWInput
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                leftIcon="lock-outline"
              />
            )}
          />

          <NWButton
            title={isLoggingIn ? 'Signing in...' : 'Sign In'}
            onPress={handleSubmit(onSubmit)}
            loading={isLoggingIn}
            fullWidth
            size="lg"
            className="mt-2"
          />

          <NWButton
            title="Forgot Password?"
            onPress={() => {}}
            variant="ghost"
            fullWidth
            className="mt-2"
          />
        </Card>

        {/* Social Login */}
        <Box className="mb-6">
          <Divider label="Or continue with" />

          <Box className="flex-row justify-center gap-4 mt-4">
            <NWButton
              title="Google"
              variant="outline"
              leftIcon={<Icon name="google" size={20} color="#DB4437" />}
              className="flex-1"
            />
            <NWButton
              title="Apple"
              variant="outline"
              leftIcon={<Icon name="apple" size={20} color="#000000" />}
              className="flex-1"
            />
          </Box>
        </Box>

        {/* Register Link */}
        <Box className="flex-row justify-center items-center">
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
          </Typography>
          <NWButton
            title="Sign Up"
            variant="ghost"
            size="sm"
            onPress={() => {}}
          />
        </Box>

        {/* Error Toast */}
        {showError && loginError && (
          <Box className="absolute bottom-8 left-4 right-4">
            <Card variant="filled" className="bg-red-500 flex-row items-center">
              <Icon name="alert-circle" size={20} color="#FFFFFF" />
              <Typography variant="body2" className="text-white ml-2 flex-1">
                {loginError}
              </Typography>
              <NWButton
                title="×"
                variant="ghost"
                size="sm"
                onPress={() => setShowError(false)}
                className="text-white"
              />
            </Card>
          </Box>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
