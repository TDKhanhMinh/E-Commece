import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, TextInput, HelperText, List } from 'react-native-paper';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = 'Select an option',
  disabled = false,
}: FormSelectProps<T>) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => !disabled && setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value);

        return (
          <View style={styles.container}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TextInput
                  label={label}
                  value={selectedOption?.label || ''}
                  placeholder={placeholder}
                  mode="outlined"
                  editable={false}
                  error={!!error}
                  disabled={disabled}
                  right={
                    <TextInput.Icon
                      icon={visible ? 'chevron-up' : 'chevron-down'}
                      onPress={openMenu}
                    />
                  }
                  onPressIn={openMenu}
                />
              }
              anchorPosition="bottom"
              style={styles.menu}>
              {options.map((option) => (
                <List.Item
                  key={option.value}
                  title={option.label}
                  onPress={() => {
                    onChange(option.value);
                    closeMenu();
                  }}
                  style={
                    option.value === value
                      ? styles.selectedItem
                      : undefined
                  }
                />
              ))}
            </Menu>
            {error && (
              <HelperText type="error" visible={!!error}>
                {error.message}
              </HelperText>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  menu: {
    width: '100%',
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
});
