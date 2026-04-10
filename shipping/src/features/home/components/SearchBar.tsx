import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
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
    <View className="flex-row items-center px-4 py-2 gap-2" style={[{ backgroundColor: theme.colors.surface }]}>
      <View
        className="flex-1 flex-row items-center rounded-xl border px-3 h-11 gap-1"
        style={[
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <Icon name="magnify" size={20} color={theme.colors.onSurfaceVariant} />
        <TextInput
          className="flex-1 text-sm p-0"
          style={[{ color: theme.colors.onSurface }]}
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
        className="w-11 h-11 rounded-xl items-center justify-center"
        style={[{ backgroundColor: theme.colors.primary }]}
        onPress={onFilterPress}
        activeOpacity={0.8}
      >
        <Icon name="tune-variant" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

