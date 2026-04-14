import React from 'react';
import { View, ScrollView } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import { Divider } from '@components/ui/Divider';
import { IconButton } from '@components/ui/IconButton';
import { Button } from '@components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function BankAccountScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const accounts = [
    {
      id: '1',
      bankName: 'Vietcombank',
      accountNumber: '102 **** 4567',
      holderName: 'TRAN VAN A',
      isDefault: true,
      color: '#00652e'
    },
    {
      id: '2',
      bankName: 'MB Bank',
      accountNumber: '098 **** 1234',
      holderName: 'TRAN VAN A',
      isDefault: false,
      color: '#004191'
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
          Tài khoản ngân hàng
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Danh sách tài khoản
        </Typography>

        {accounts.map((account) => (
          <Card key={account.id} className="p-0 overflow-hidden mb-4 shadow-sm">
            <View
              style={{ backgroundColor: account.color }}
              className="p-4 flex-row justify-between items-center"
            >
              <Typography variant="body1" className="text-white font-bold">
                {account.bankName}
              </Typography>
              {account.isDefault && (
                <View className="bg-white/20 px-2 py-0.5 rounded">
                  <Typography variant="caption" className="text-white font-medium">Mặc định</Typography>
                </View>
              )}
            </View>
            <View className="p-4 bg-white">
              <Typography variant="h6" className="tracking-widest text-gray-800 mb-1">
                {account.accountNumber}
              </Typography>
              <Typography variant="caption" className="text-gray-500 uppercase">
                Chủ tài khoản: {account.holderName}
              </Typography>

              <View className="flex-row justify-end mt-4">
                <Button
                  variant="ghost"
                  title="Xóa"
                  className="mr-2"
                />
                <Button
                  variant="outline"
                  title="Chi tiết"
                />
              </View>
            </View>
          </Card>
        ))}

        <Button
          variant="outline"
          title="THÊM TÀI KHOẢN MỚI"
          leftIcon={<Icon name="plus" size={20} color="#1e40af" />}
          className="mt-4 border-dashed border-2 bg-transparent"
          fullWidth
        />

        <View className="bg-blue-50 p-4 rounded-xl mt-8">
          <View className="flex-row items-start">
            <Icon name="information-outline" size={20} color="#1e40af" className="mt-0.5" />
            <Typography variant="body2" className="ml-2 text-blue-800 flex-1">
              Hệ thống sẽ chuyển tiền vào tài khoản mặc định của bạn mỗi thứ 2 hàng tuần (nếu số dư trên 200,000đ).
            </Typography>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
