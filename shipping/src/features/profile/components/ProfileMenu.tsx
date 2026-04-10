import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import { Divider } from '@components/ui/Divider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  showDivider?: boolean;
}

function MenuItem({ icon, label, onPress, showDivider = true }: MenuItemProps) {
  return (
    <View>
      <Pressable 
        className="flex-row items-center justify-between py-4 px-4 active:bg-gray-50"
        onPress={onPress}
      >
        <View className="flex-row items-center">
          <View className="w-10 items-center">
            <Icon name={icon} size={24} color="#1e40af" />
          </View>
          <Typography variant="body1" className="ml-2 font-medium text-gray-800">
            {label}
          </Typography>
        </View>
        <Icon name="chevron-right" size={20} color="#9ca3af" />
      </Pressable>
      {showDivider && <Divider className="ml-14" />}
    </View>
  );
}

export function ProfileMenu() {
  return (
    <View className="px-4">
      <Card variant="outlined" className="bg-white p-0 rounded-2xl overflow-hidden shadow-sm">
        {/* Personal Group */}
        <MenuItem 
          icon="car-side" 
          label="Phương tiện của tôi" 
          onPress={() => console.log('Vehicle')} 
        />
        <MenuItem 
          icon="bank-outline" 
          label="Tài khoản ngân hàng" 
          onPress={() => console.log('Bank')} 
        />
        <MenuItem 
          icon="cog-outline" 
          label="Cài đặt ứng dụng" 
          onPress={() => console.log('Settings')} 
        />
        <MenuItem 
          icon="headphones" 
          label="Trung tâm hỗ trợ" 
          onPress={() => console.log('Support')} 
        />
        <MenuItem 
          icon="file-document-outline" 
          label="Chính sách & Điều khoản" 
          onPress={() => console.log('Policy')} 
          showDivider={false}
        />
      </Card>
    </View>
  );
}
