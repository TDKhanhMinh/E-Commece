import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, Button, useTheme, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FormInput,
  useFormWithSchema,
  registerSchema,
  type RegisterFormData,
} from '@shared/lib/form';
import { spacing } from '@styles/index';
import { useAuth } from '../hooks/useAuth';
import type { AuthStackScreenProps } from '@navigation/types';

type Props = AuthStackScreenProps<'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { register, isRegistering, registerError } = useAuth();
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  const { control, handleSubmit } = useFormWithSchema<RegisterFormData>({
    schema: registerSchema,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        name: data.fullName,
        phone: data.phone,
      });
      setSnackbar({
        visible: true,
        message: 'Đăng ký tài khoản thành công',
        type: 'success'
      });
    } catch (err) {
      setSnackbar({
        visible: true,
        message: registerError || 'Đăng ký thất bại. Vui lòng thử lại.',
        type: 'error'
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Sign up to get started
          </Text>
        </View>

        <View style={styles.form}>
          <FormInput
            control={control}
            name="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            control={control}
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <FormInput
            control={control}
            name="password"
            label="Password"
            placeholder="Create a password"
            secureTextEntry
          />

          <FormInput
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isRegistering}
            disabled={isRegistering}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}>
            Create Account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Already have an account?
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}>
            Sign In
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
        duration={4000}
        style={{
          backgroundColor: snackbar.type === 'success' ? '#4CAF50' : '#F44336',
        }}
        action={{
          label: 'OK',
          onPress: () => setSnackbar(prev => ({ ...prev, visible: false })),
          textColor: '#fff'
        }}>
        {snackbar.message}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  form: {
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
