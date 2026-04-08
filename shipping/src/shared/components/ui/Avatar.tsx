import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; imageSize: number }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', imageSize: 24 },
  sm: { container: 'w-8 h-8', text: 'text-sm', imageSize: 32 },
  md: { container: 'w-10 h-10', text: 'text-base', imageSize: 40 },
  lg: { container: 'w-14 h-14', text: 'text-xl', imageSize: 56 },
  xl: { container: 'w-20 h-20', text: 'text-2xl', imageSize: 80 },
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getColorFromName(name?: string): string {
  if (!name) return 'bg-gray-400';
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

export function Avatar({ source, name, size = 'md', className = '' }: AvatarProps) {
  const sizeStyle = sizeClasses[size];

  if (source) {
    return (
      <Image
        source={source}
        className={`rounded-full ${sizeStyle.container} ${className}`}
        style={{ width: sizeStyle.imageSize, height: sizeStyle.imageSize }}
      />
    );
  }

  const bgColor = getColorFromName(name);
  const initials = getInitials(name);

  return (
    <View
      className={`
        rounded-full items-center justify-center
        ${sizeStyle.container}
        ${bgColor}
        ${className}
      `}>
      <Text className={`text-white font-semibold ${sizeStyle.text}`}>
        {initials}
      </Text>
    </View>
  );
}
