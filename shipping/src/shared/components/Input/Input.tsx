import React, { memo, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '@styles/index';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  required?: boolean;
}

function InputComponent({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  required = false,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const getBorderColor = (): string => {
    if (error) return colors.error.main;
    if (isFocused) return colors.primary[500];
    return colors.grey[300];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          { borderColor: getBorderColor() },
          isFocused && styles.inputFocused,
          error && styles.inputError,
          inputStyle,
        ]}
        placeholderTextColor={colors.grey[400]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...textInputProps}
      />
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.text.primary.light,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  required: {
    color: colors.error.main,
  },
  input: {
    ...typography.body1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.common.white,
    color: colors.text.primary.light,
  },
  inputFocused: {
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error.main,
  },
  helperText: {
    ...typography.caption,
    color: colors.text.secondary.light,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error.main,
  },
});

export const Input = memo(InputComponent);
