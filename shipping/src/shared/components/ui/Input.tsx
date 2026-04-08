import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerClassName?: string;
  inputClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerClassName = '',
  inputClassName = '',
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showPasswordToggle = secureTextEntry && !rightIcon;
  const actualSecureEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center
          bg-white dark:bg-gray-900
          border rounded-lg
          ${isFocused ? 'border-primary-500 border-2' : 'border-gray-300 dark:border-gray-700'}
          ${error ? 'border-error' : ''}
        `}>
        {leftIcon && (
          <View className="pl-3">
            <Icon
              name={leftIcon}
              size={20}
              color={error ? '#F44336' : isFocused ? '#2196F3' : '#9E9E9E'}
            />
          </View>
        )}

        <TextInput
          className={`
            flex-1 px-4 py-3
            text-base text-gray-900 dark:text-white
            ${leftIcon ? 'pl-2' : ''}
            ${rightIcon || showPasswordToggle ? 'pr-2' : ''}
            ${inputClassName}
          `}
          placeholderTextColor="#9E9E9E"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={actualSecureEntry}
          {...props}
        />

        {showPasswordToggle && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="pr-3">
            <Icon
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#9E9E9E"
            />
          </Pressable>
        )}

        {rightIcon && !showPasswordToggle && (
          <Pressable
            onPress={onRightIconPress}
            className="pr-3"
            disabled={!onRightIconPress}>
            <Icon name={rightIcon} size={20} color="#9E9E9E" />
          </Pressable>
        )}
      </View>

      {(error || helperText) && (
        <Text
          className={`text-xs mt-1 ${error ? 'text-error' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}
