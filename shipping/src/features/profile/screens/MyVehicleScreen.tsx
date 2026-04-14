import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import { Divider } from '@components/ui/Divider';
import { IconButton } from '@components/ui/IconButton';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function MyVehicleScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
          Phương tiện của tôi
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Card */}
        <Card className="p-0 overflow-hidden mb-6">
          <View className="bg-blue-600 p-6 items-center">
            <Icon name="truck-delivery" size={64} color="white" />
            <Typography variant="h5" className="text-white font-bold mt-2">
              Xe Tải Van
            </Typography>
            <Typography variant="body2" className="text-blue-100">
              Biển số: 29C-123.45
            </Typography>
          </View>

          <View className="p-4 bg-white">
            <View className="flex-row justify-between mb-3">
              <Typography variant="body2" className="text-gray-500">Thương hiệu</Typography>
              <Typography variant="body1" className="font-medium">Suzuki Carry Pro</Typography>
            </View>
            <Divider className="my-2" />
            <View className="flex-row justify-between mb-3">
              <Typography variant="body2" className="text-gray-500">Tải trọng</Typography>
              <Typography variant="body1" className="font-medium">750 kg</Typography>
            </View>
            <Divider className="my-2" />
            <View className="flex-row justify-between mb-3">
              <Typography variant="body2" className="text-gray-500">Trạng thái</Typography>
              <View className="bg-green-100 px-2 py-1 rounded">
                <Typography variant="caption" className="text-green-700 font-bold">HOẠT ĐỘNG</Typography>
              </View>
            </View>
          </View>
        </Card>

        {/* Maintenance Info */}
        <Typography variant="h6" className="font-bold mb-3 text-gray-800">
          Bảo trì & Đăng kiểm
        </Typography>
        <Card className="p-4 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Icon name="calendar-clock" size={20} color="#f97316" />
            </View>
            <View className="flex-1">
              <Typography variant="body1" className="font-medium">Đăng kiểm tiếp theo</Typography>
              <Typography variant="body2" className="text-gray-500">Còn 45 ngày nữa</Typography>
            </View>
            <Typography variant="body2" className="text-gray-800">28/05/2026</Typography>
          </View>

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-3">
              <Icon name="shield-check" size={20} color="#4f46e5" />
            </View>
            <View className="flex-1">
              <Typography variant="body1" className="font-medium">Bảo hiểm dân sự</Typography>
              <Typography variant="body2" className="text-gray-500">Hết hạn trong 120 ngày</Typography>
            </View>
            <Typography variant="body2" className="text-gray-800">15/08/2026</Typography>
          </View>
        </Card>

        {/* Action Buttons */}
        <Card className="p-4 border-dashed border-2 border-gray-200 bg-transparent shadow-none">
          <View className="flex-row items-center justify-center py-2">
            <Icon name="plus-circle" size={24} color="#1e40af" />
            <Typography variant="body1" className="ml-2 text-blue-800 font-bold">
              Cập nhật hồ sơ xe mới
            </Typography>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
