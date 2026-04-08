import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import {
  Controller,
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  left,
  right,
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInput
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!error}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            multiline={multiline}
            numberOfLines={numberOfLines}
            disabled={disabled}
            mode="outlined"
            left={left}
            right={right}
            style={multiline ? styles.multilineInput : undefined}
          />
          {error && (
            <HelperText type="error" visible={!!error}>
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  multilineInput: {
    minHeight: 100,
  },
});
