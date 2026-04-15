import React, { useState, useEffect } from 'react';
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
import { Snackbar } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useFormWithSchema,
  resetPasswordSchema,
  type ResetPasswordFormData,
  Controller,
} from '@shared/lib/form';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import type { AuthStackScreenProps, AuthStackParamList } from '@navigation/types';

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'ResetPassword'>['navigation']>();
  const route = useRoute<ResetPasswordRouteProp>();
  const { token } = route.params;
  const { resetPassword, isResettingPassword } = useAuth();
  
  const [password, setPassword] = useState('');

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  const validationRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormWithSchema<ResetPasswordFormData>({
    schema: resetPasswordSchema,
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword({ token, newPassword: data.password });
      setSnackbar({
        visible: true,
        message: 'Đổi mật khẩu thành công',
        type: 'success'
      });
      // Navigate back to Login after success
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      setSnackbar({
        visible: true,
        message: 'Đổi mật khẩu thất bại. Vui lòng thử lại.',
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
            <Text className="text-3xl font-bold text-gray-900">Create New Password</Text>
            <Text className="text-gray-500 mt-2 text-base">
              Set a strong password to keep your account secure.
            </Text>
          </View>

          {/* Form */}
          <View className="flex-1">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter password"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    setPassword(text);
                  }}
                  value={value}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            {/* Validation Rules */}
            <View className="mb-6 -mt-2">
              <View className="flex-row items-center mb-1">
                <Icon name={validationRules.length ? 'check' : 'close'} size={14} color={validationRules.length ? '#4CAF50' : '#F44336'} />
                <Text className={`ml-2 text-xs font-medium ${validationRules.length ? 'text-success' : 'text-error'}`}>Minimum 8 characters.</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <Icon name={validationRules.uppercase ? 'check' : 'close'} size={14} color={validationRules.uppercase ? '#4CAF50' : '#F44336'} />
                <Text className={`ml-2 text-xs font-medium ${validationRules.uppercase ? 'text-success' : 'text-error'}`}>At least one uppercase letter (A-Z).</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <Icon name={validationRules.number ? 'check' : 'close'} size={14} color={validationRules.number ? '#4CAF50' : '#F44336'} />
                <Text className={`ml-2 text-xs font-medium ${validationRules.number ? 'text-success' : 'text-error'}`}>At least one number (0-9).</Text>
              </View>
            </View>

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Enter password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                />
              )}
            />

            <View className="flex-1" />

            <View className="mb-8">
              <Button
                title="Confirm"
                onPress={handleSubmit(onSubmit)}
                loading={isResettingPassword}
                className="bg-success py-4 rounded-xl"
                size="lg"
                disabled={!validationRules.length || !validationRules.uppercase || !validationRules.number || isResettingPassword}
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
