import React from 'react';
import { View, ScrollView } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import { Divider } from '@components/ui/Divider';
import { IconButton } from '@components/ui/IconButton';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function PolicyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: '1. Điều khoản sử dụng',
      content: 'Bằng việc sử dụng ứng dụng GIAO HÀNG VIỆT, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây. Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào...'
    },
    {
      title: '2. Chính sách bảo mật',
      content: 'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu vị trí, thông tin tài khoản và lịch sử giao hàng được thu thập chỉ nhằm mục đích phục vụ vận hành và cải thiện chất lượng dịch vụ...'
    },
    {
      title: '3. Quy định đối với tài xế',
      content: 'Tài xế cam kết cung cấp thông tin chính xác về phương tiện, giấy tờ tùy thân và đảm bảo thái độ phục vụ chuyên nghiệp, đúng thời gian yêu cầu của các đơn hàng...'
    },
    {
      title: '4. Chính sách thanh toán',
      content: 'Các giao dịch thanh toán, rút tiền và đối soát sẽ được thực hiện định kỳ theo quy định của công ty. Mọi thắc mắc về số dư vui lòng liên hệ trung tâm hỗ trợ...'
    }
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
          Chính sách & Điều khoản
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Card className="p-0 overflow-hidden mb-6">
          <View className="p-6 bg-blue-50">
            <Typography variant="h5" className="text-blue-900 font-bold mb-2">
              Giao Hàng Việt
            </Typography>
            <Typography variant="body2" className="text-blue-700">
              Cập nhật lần cuối: 10/04/2026
            </Typography>
          </View>

          <View className="p-6 bg-white">
            {sections.map((section, index) => (
              <View key={index} className="mb-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-2">
                  {section.title}
                </Typography>
                <Typography variant="body2" className="text-gray-600 leading-6 text-justify">
                  {section.content}
                </Typography>
                {index < sections.length - 1 && <Divider className="mt-6" />}
              </View>
            ))}
          </View>
        </Card>

        <View className="items-center mb-8">
          <Typography variant="caption" className="text-gray-400">
            © 2026 Giao Hàng Việt Corporation. All rights reserved.
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}
