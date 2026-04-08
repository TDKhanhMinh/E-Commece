import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Text, HelperText, useTheme } from 'react-native-paper';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  disabled?: boolean;
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
}: FormCheckboxProps<T>) {
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <View style={styles.row}>
            <Checkbox
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
              disabled={disabled}
            />
            <Text
              style={[
                styles.label,
                { color: disabled ? theme.colors.onSurfaceDisabled : theme.colors.onSurface },
              ]}
              onPress={() => !disabled && onChange(!value)}>
              {label}
            </Text>
          </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    flex: 1,
  },
});
