import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, borderRadius } from '@styles/index';

interface SearchBarProps {
  onSearch?: (text: string) => void;
  onFilterPress?: () => void;
}

export function SearchBar({ onSearch, onFilterPress }: SearchBarProps) {
  const theme = useTheme();
  const [text, setText] = useState('');

  const handleChange = (value: string) => {
    setText(value);
    onSearch?.(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <Icon name="magnify" size={20} color={theme.colors.onSurfaceVariant} />
        <TextInput
          style={[styles.input, { color: theme.colors.onSurface }]}
          placeholder="Tìm kiếm đơn hàng..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={text}
          onChangeText={handleChange}
          returnKeyType="search"
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={() => handleChange('')}>
            <Icon name="close-circle" size={18} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter button */}
      <TouchableOpacity
        style={[styles.filterBtn, { backgroundColor: theme.colors.primary }]}
        onPress={onFilterPress}
        activeOpacity={0.8}
      >
        <Icon name="tune-variant" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    height: 44,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
