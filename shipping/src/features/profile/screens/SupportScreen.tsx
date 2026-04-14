import React from 'react';
import { View, ScrollView, Linking, Pressable } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import { Divider } from '@components/ui/Divider';
import { IconButton } from '@components/ui/IconButton';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function SupportScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleCall = () => Linking.openURL('tel:19001234');

  const faqs = [
    { question: 'Làm thế nào để rút tiền?', icon: 'cash-withdraw' },
    { question: 'Tôi gặp sự cố khi đang giao hàng', icon: 'alert-circle-outline' },
    { question: 'Quy trình đối soát tài xế', icon: 'file-check-outline' },
    { question: 'Cập nhật thông tin phương tiện', icon: 'car-settings' },
  ];

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
          Trung tâm hỗ trợ
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Liên hệ với chúng tôi
        </Typography>

        <View className="flex-row mb-6">
          <Pressable onPress={handleCall} className="flex-1 mr-2">
            <Card className="items-center p-4 bg-white border-blue-100">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                <Icon name="phone" size={24} color="#1e40af" />
              </View>
              <Typography variant="body1" className="font-bold">Hotline</Typography>
              <Typography variant="caption" className="text-gray-500">24/7</Typography>
            </Card>
          </Pressable>

          <Pressable className="flex-1 ml-2">
            <Card className="items-center p-4 bg-white border-blue-100">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <Icon name="message-text" size={24} color="#16a34a" />
              </View>
              <Typography variant="body1" className="font-bold">Chat trực tuyến</Typography>
              <Typography variant="caption" className="text-gray-500">Phản hồi nhanh</Typography>
            </Card>
          </Pressable>
        </View>

        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Câu hỏi thường gặp (FAQ)
        </Typography>

        <Card className="p-0 overflow-hidden rounded-2xl mb-6">
          {faqs.map((faq, index) => (
            <View key={index}>
              <Pressable className="flex-row items-center justify-between p-4 active:bg-gray-50">
                <View className="flex-row items-center flex-1">
                  <Icon name={faq.icon} size={20} color="#64748b" />
                  <Typography variant="body1" className="ml-3 text-gray-700">{faq.question}</Typography>
                </View>
                <Icon name="chevron-right" size={20} color="#cbd5e1" />
              </Pressable>
              {index < faqs.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        <Card className="p-6 bg-blue-600 rounded-3xl">
          <Typography variant="h6" className="text-white font-bold mb-2">
            Gửi yêu cầu hỗ trợ
          </Typography>
          <Typography variant="body2" className="text-blue-100 mb-4">
            Nếu bạn không tìm thấy câu trả lời, hãy gửi yêu cầu. Chúng tôi sẽ phản hồi trong vòng 24h.
          </Typography>
          <Pressable className="bg-white py-3 rounded-xl items-center">
            <Typography variant="body1" className="text-blue-600 font-bold">GỬI YÊU CẦU</Typography>
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}
