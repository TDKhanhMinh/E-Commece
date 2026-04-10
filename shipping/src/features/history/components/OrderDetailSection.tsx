import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Platform, PermissionsAndroid, Alert, Modal } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import { useSuccessfulDelivery, useUploadImage } from '../hooks/useOrderHistory';
import { useNavigation } from '@core/navigation/useNavigation';
import { RouteMapSection } from './RouteMapSection';

interface OrderDetailSectionProps {
  order: any;
}

export const OrderDetailSection = ({ order }: OrderDetailSectionProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [proofImage, setProofImage] = useState<string | null>(null);
  const { mutateAsync: uploadImage } = useUploadImage();

  // Custom Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  const successfulDelivery = useSuccessfulDelivery();

  const handSuccessfulDelivery = async (deliveryId: string) => {
    try {
      const response = await successfulDelivery.mutateAsync(deliveryId);
      console.log('Successful delivery response', response);

      setModalConfig({
        type: 'success',
        title: 'Thành công',
        message: 'Đã cập nhật trạng thái giao hàng thành công',
      });
      setModalVisible(true);

      // Navigate back to Shipments list after successful confirmation
      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error updating delivery status:', error);

      setModalConfig({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể cập nhật trạng thái giao hàng. Vui lòng thử lại.',
      });
      setModalVisible(true);
    }
  };
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Quyền truy cập Camera',
            message: 'Ứng dụng cần quyền truy cập camera để chụp ảnh minh chứng giao hàng.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          return true;
        } else {
          console.log('Camera permission denied');
          Alert.alert(
            'Quyền truy cập bị từ chối',
            'Vui lòng cấp quyền camera trong Cài đặt để sử dụng tính năng này.',
          );
          return false;
        }
      } catch (err) {
        console.error('Error requesting camera permission:', err);
        return false;
      }
    }
    return true;
  };

  const handleCaptureProof = async () => {
    try {
      // Request camera permission first
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return;
      }

      console.log('Opening camera...');
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
        saveToPhotos: true,
      });
      console.log("📸 Camera result:", JSON.stringify(result, null, 2));

      if (result.didCancel) {
        console.log('Người dùng đã hủy chụp ảnh');
        return;
      }

      if (result.errorCode) {
        console.error('Lỗi Camera:', result.errorMessage);
        Alert.alert('Lỗi Camera', result.errorMessage || 'Không thể mở camera');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        if (!asset.uri) {
          console.error('Không có URI từ ảnh');
          return;
        }

        console.log('Image captured:', asset.uri);
        setProofImage(asset.uri);

        // Upload the image
        const fileData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `proof_${Date.now()}.jpg`,
        };

        console.log('Uploading image with data:', fileData);

        try {
          const uploadResult = await uploadImage(fileData);
          console.log('Upload SUCCESS:', JSON.stringify(uploadResult, null, 2));
          Alert.alert('Thành công', 'Đã tải lên ảnh minh chứng');
        } catch (uploadError) {
          console.error('Upload FAILED:', uploadError);
          Alert.alert('Lỗi tải lên', 'Không thể tải ảnh lên server. Vui lòng thử lại.');
        }
      }
    } catch (err) {
      console.error('Lỗi khi chụp ảnh hoặc tải lên:', err);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = () => {
    switch (order.deliveryStatus) {
      case 'SUCCESS':
      case 'completed':
        return '#4CAF50';
      case 'CANCELLED':
      case 'cancelled':
        return '#F44336';
      case 'PICKED_UP':
      case 'picking_up':
        return '#FF9800';
      case 'DELIVERING':
      case 'delivering':
        return '#2196F3';
      case 'PENDING':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = () => {
    switch (order.deliveryStatus) {
      case 'SUCCESS':
      case 'completed':
        return 'HOÀN THÀNH';
      case 'CANCELLED':
      case 'cancelled':
        return 'ĐÃ HỦY';
      case 'PICKED_UP':
      case 'picking_up':
        return 'ĐÃ LẤY HÀNG';
      case 'DELIVERING':
      case 'delivering':
        return 'ĐANG GIAO HÀNG';
      case 'PENDING':
        return 'CHỜ NHẬN ĐƠN';
      default:
        return 'KHÔNG XÁC ĐỊNH';
    }
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: '#F3F4F6' }} showsVerticalScrollIndicator={false}>
      <View className="p-4 gap-4 pb-12">
        {/* Khối Thông tin chung (Mã vận đơn, Trạng thái) */}
        <View className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 pr-2">
              <Text className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1">Mã vận đơn</Text>
              <Text className="text-gray-900 text-lg font-black tracking-tight">
                {order.trackingNumber || `Đơn hàng #${order.orderId || order.deliveryId}`}
              </Text>
            </View>
            <View
              className="px-3 py-1.5 rounded-full border shadow-sm"
              style={{ backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() + '30' }}
            >
              <Text style={{ color: getStatusColor(), fontWeight: '800', fontSize: 11 }}>
                {getStatusLabel()}
              </Text>
            </View>
          </View>

          {(order.createdAt || order.deliveredAt) && (
            <View className="flex-row items-center gap-2 mt-2 bg-gray-50 self-start px-3 py-1.5 rounded-lg border border-gray-100">
              <Icon name="calendar-clock" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-xs font-semibold">
                {formatDate(order.createdAt || order.deliveredAt)}
              </Text>
            </View>
          )}
        </View>
        <RouteMapSection order={order} />
        {/* Khối Thông tin Khách Hàng */}
        <View className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <Icon name="account-box-outline" size={20} color="#2563EB" />
            </View>
            <Text className="text-gray-900 font-bold text-[15px]">Thông tin khách hàng</Text>
          </View>

          <View className="bg-gray-50 rounded-xl p-4 gap-3 border border-gray-200/60">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm font-medium">Họ tên</Text>
              <Text className="text-gray-900 font-bold text-sm tracking-tight">{order.customerName || 'Chưa cập nhật'}</Text>
            </View>
            <View className="h-[1px] w-full bg-gray-200/50" />
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm font-medium">Số điện thoại</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-gray-900 font-bold text-sm tracking-tight">{order.customerPhone || 'Chưa cập nhật'}</Text>
                {order.customerPhone && (
                  <TouchableOpacity className="bg-emerald-50 w-7 h-7 rounded-full items-center justify-center border border-emerald-200">
                    <Icon name="phone" size={14} color="#10B981" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Khối Danh sách Hàng hoá */}
        <View className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="p-1.5 bg-purple-50 rounded-lg border border-purple-100">
              <Icon name="package-variant-closed" size={20} color="#9333EA" />
            </View>
            <Text className="text-gray-900 font-bold text-[15px]">Chi tiết hàng hóa</Text>
          </View>

          <View className="gap-3">
            {order.items?.map((item: any, index: number) => (
              <View key={index} className="flex-row items-start bg-white p-3 rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <View className="bg-gray-50 w-12 h-12 rounded-lg items-center justify-center border border-gray-100 mr-3">
                  <Icon name="cube-outline" size={24} color="#9CA3AF" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-[13px] mb-1.5 leading-5" numberOfLines={2}>
                    {item.productName || item.name}
                  </Text>
                  <Text className="text-gray-500 text-xs font-medium">
                    Đơn giá: <Text className="text-gray-900 font-semibold">{item.salePrice?.toLocaleString('vi-VN') || item.price?.toLocaleString('vi-VN')} đ</Text>
                    {item.skuCode ? ` • Mã: ${item.skuCode}` : ''}
                  </Text>
                </View>
                <View className="bg-purple-100 px-2 py-1 rounded-md border border-purple-200 ml-2">
                  <Text className="text-purple-800 font-black text-xs">x{item.quantity}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Khối Thanh toán (COD) - Nổi bật */}
        <View className="bg-emerald-50 rounded-[20px] p-5 shadow-sm border border-emerald-200">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="bg-emerald-100 p-1.5 rounded-full">
              <Icon name="cash" size={20} color="#059669" />
            </View>
            <Text className="text-emerald-900 font-bold text-[15px]">Tổng thanh toán</Text>
          </View>

          <View className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
            <Text className="text-gray-600 font-medium text-sm">Tiền thu hộ (COD)</Text>
            <Text className="text-emerald-600 font-black text-[22px]">
              {order.codAmount?.toLocaleString('vi-VN') || 0} <Text className="text-sm font-bold">đ</Text>
            </Text>
          </View>
        </View>

        {/* Khối Hành động (Chụp ảnh & Xác nhận) */}
        {order.deliveryStatus === 'PICKED_UP' && (
          <View className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="p-1.5 bg-orange-50 rounded-lg border border-orange-100">
                <Icon name="lightning-bolt" size={20} color="#EA580C" />
              </View>
              <Text className="text-gray-900 font-bold text-[15px]">Thao tác đơn hàng</Text>
            </View>

            {/* Chụp ảnh */}
            <TouchableOpacity
              onPress={handleCaptureProof}
              activeOpacity={0.7}
              className={`flex-row items-center justify-center p-4 rounded-xl mb-4 border-2 ${proofImage
                ? 'border-emerald-400 bg-emerald-50 border-solid'
                : 'border-orange-300 bg-orange-50/50 border-dashed'
                }`}
            >
              {proofImage ? (
                <View className="flex-row items-center w-full">
                  <Image source={{ uri: proofImage }} className="w-12 h-12 rounded-lg mr-3" />
                  <View className="flex-1">
                    <Text className="text-emerald-700 font-bold text-sm">Đã tải lên minh chứng</Text>
                    <Text className="text-emerald-600/80 text-xs mt-0.5">Nhấn để chụp lại</Text>
                  </View>
                  <View className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm">
                    <Icon name="check-circle" size={20} color="#10B981" />
                  </View>
                </View>
              ) : (
                <View className="flex-row items-center py-2">
                  <Icon name="camera-plus" size={24} color="#EA580C" />
                  <Text className="text-orange-600 font-bold ml-2">Chụp ảnh phát hàng</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Các nút hành động chính */}
            <TouchableOpacity
              className="bg-blue-600 rounded-xl py-4 flex-row justify-center items-center gap-2 mb-3 shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
              onPress={() => handSuccessfulDelivery(order.deliveryId)}
              activeOpacity={0.8}
            >
              <Icon name="truck-check" size={22} color="#FFFFFF" />
              <Text className="text-white font-black tracking-wide text-[15px]">
                XÁC NHẬN GIAO HÀNG
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-center py-3.5 bg-red-50 rounded-xl border border-red-100"
            >
              <Icon name="alert-circle" size={18} color="#DC2626" />
              <Text className="text-red-600 font-bold ml-2">Báo cáo sự cố</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>

      {/* Custom Alert Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full max-w-[340px] rounded-3xl p-6 items-center shadow-xl">
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${modalConfig.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'
                }`}
            >
              <Icon
                name={modalConfig.type === 'success' ? 'check-circle' : 'close-circle'}
                size={40}
                color={modalConfig.type === 'success' ? '#10B981' : '#EF4444'}
              />
            </View>
            <Text className="text-xl font-black text-gray-900 mb-2">
              {modalConfig.title}
            </Text>
            <Text className="text-center text-gray-600 mb-6 font-medium text-[15px] leading-5">
              {modalConfig.message}
            </Text>

            <TouchableOpacity
              className={`w-full py-4 rounded-2xl flex-row justify-center items-center ${modalConfig.type === 'success' ? 'bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.3)]' : 'bg-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)]'
                }`}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-black tracking-wide text-[15px]">
                ĐÓNG
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

