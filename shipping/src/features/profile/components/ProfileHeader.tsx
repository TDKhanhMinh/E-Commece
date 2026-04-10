import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Avatar } from '@components/ui/Avatar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function ProfileHeader() {
  return (
    <View className="items-center py-6">
      <View className="relative">
        <Avatar 
          name="Trần Đỗ Khánh Minh"
          size="xl" 
          className="w-32 h-32" // Custom size override for profile
        />
        <Pressable 
          className="absolute bottom-0 right-0 bg-primary-500 p-2 rounded-full border-2 border-white"
          onPress={() => console.log('Change avatar')}
        >
          <Icon name="camera" size={16} color="#FFF" />
        </Pressable>
      </View>

      <Typography variant="h3" className="mt-4 font-bold text-gray-900">
        Trần Đỗ Khánh Minh
      </Typography>
      
      <Typography variant="body2" className="text-gray-500 font-medium">
        ID: 52200117
      </Typography>

      <View className="flex-row items-center mt-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
        <Typography variant="h6" className="text-amber-600 font-bold mr-1">
          4.9
        </Typography>
        <Icon name="star" size={18} color="#f59e0b" />
      </View>
    </View>
  );
}
