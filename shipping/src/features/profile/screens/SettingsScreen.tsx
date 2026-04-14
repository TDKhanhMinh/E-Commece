import React, { useState } from 'react';
import { View, ScrollView, Switch } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import { Divider } from '@components/ui/Divider';
import { IconButton } from '@components/ui/IconButton';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white px-4 py-4 flex-row items-center border-b border-gray-100"
      >
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          className="mr-2"
        />
        <Typography variant="h6" className="font-bold text-gray-800">
          Cài đặt ứng dụng
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="h6" className="font-bold px-4 py-4 text-gray-800">
          Thông báo & Bảo mật
        </Typography>
        <Card className="p-0 mx-4 overflow-hidden rounded-2xl">
          <View className="flex-row items-center justify-between p-4 bg-white">
            <View className="flex-row items-center">
              <Icon name="bell-outline" size={24} color="#1e40af" />
              <Typography variant="body1" className="ml-3 font-medium">Thông báo đẩy</Typography>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={notifications ? '#1e40af' : '#f3f4f6'}
            />
          </View>
          <Divider />
          <View className="flex-row items-center justify-between p-4 bg-white">
            <View className="flex-row items-center">
              <Icon name="fingerprint" size={24} color="#1e40af" />
              <Typography variant="body1" className="ml-3 font-medium">Vân tay / FaceID</Typography>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={biometrics ? '#1e40af' : '#f3f4f6'}
            />
          </View>
        </Card>

        <Typography variant="h6" className="font-bold px-4 py-4 mt-4 text-gray-800">
          Giao diện & Ngôn ngữ
        </Typography>
        <Card className="p-0 mx-4 overflow-hidden rounded-2xl">
          <View className="flex-row items-center justify-between p-4 bg-white">
            <View className="flex-row items-center">
              <Icon name="theme-light-dark" size={24} color="#1e40af" />
              <Typography variant="body1" className="ml-3 font-medium">Chế độ tối</Typography>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={darkMode ? '#1e40af' : '#f3f4f6'}
            />
          </View>
          <Divider />
          <View className="p-4 bg-white flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Icon name="translate" size={24} color="#1e40af" />
              <Typography variant="body1" className="ml-3 font-medium">Ngôn ngữ</Typography>
            </View>
            <Typography variant="body2" className="text-gray-500">Tiếng Việt</Typography>
          </View>
        </Card>

        <Typography variant="h6" className="font-bold px-4 py-4 mt-4 text-gray-800">
          Khác
        </Typography>
        <Card className="p-0 mx-4 overflow-hidden rounded-2xl">
          <View className="p-4 bg-white flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Icon name="cached" size={24} color="#1e40af" />
              <Typography variant="body1" className="ml-3 font-medium">Xóa bộ nhớ đệm (Cache)</Typography>
            </View>
            <Typography variant="body2" className="text-gray-500">24 MB</Typography>
          </View>
          <Divider />
          <View className="p-4 bg-white flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Icon name="information-outline" size={24} color="#1e40af" />
              <Typography variant="body1" className="ml-3 font-medium">Phiên bản</Typography>
            </View>
            <Typography variant="body2" className="text-gray-500">1.0.24 (Stable)</Typography>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
