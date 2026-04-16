import React, { useState } from 'react';
import { View, TouchableOpacity, Modal as RNModal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWithdraw } from '../hooks';

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  currentBalance: number;
}

export function WithdrawModal({ visible, onClose, currentBalance }: WithdrawModalProps) {
  const theme = useTheme();
  const withdrawMutation = useWithdraw();

  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: '' as 'success' | 'error' });

  const quickAmounts = [50000, 100000, 200000, 500000];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN');
  };

  const parseAmount = (text: string): number => {
    return Number(text.replace(/\D/g, '')) || 0;
  };

  const handleAmountChange = (text: string) => {
    const numericOnly = text.replace(/\D/g, '');
    if (numericOnly === '') {
      setAmount('');
      return;
    }
    const num = Number(numericOnly);
    setAmount(formatCurrency(num));
  };

  const handleQuickAmount = (value: number) => {
    setAmount(formatCurrency(value));
  };

  const handleReset = () => {
    setAmount('');
    setBankName('');
    setBankAccountNumber('');
    setDescription('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleWithdraw = () => {
    const numericAmount = parseAmount(amount);

    if (numericAmount <= 0) {
      setSnackbar({ visible: true, message: 'Vui lòng nhập số tiền hợp lệ', type: 'error' });
      return;
    }

    if (numericAmount > currentBalance) {
      setSnackbar({ visible: true, message: 'Số dư không đủ để thực hiện giao dịch', type: 'error' });
      return;
    }

    if (numericAmount < 10000) {
      setSnackbar({ visible: true, message: 'Số tiền rút tối thiểu là 10.000đ', type: 'error' });
      return;
    }

    withdrawMutation.mutate(
      {
        amount: numericAmount,
        bankName: bankName.trim() || undefined,
        bankAccountNumber: bankAccountNumber.trim() || undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setSnackbar({ visible: true, message: 'Yêu cầu rút tiền đã được gửi. Vui lòng chờ xử lý.', type: 'success' });
          setTimeout(() => handleClose(), 1500);
        },
        onError: (error) => {
          setSnackbar({ visible: true, message: error.message || 'Có lỗi xảy ra, vui lòng thử lại.', type: 'error' });
        },
      }
    );
  };

  const numericAmount = parseAmount(amount);
  const isValidAmount = numericAmount >= 10000 && numericAmount <= currentBalance;

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[32px] max-h-[90%]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#f0fdfa' }}
                >
                  <Icon name="bank-transfer-out" size={22} color="#0f766e" />
                </View>
                <Text variant="titleLarge" className="font-bold text-slate-900">
                  Rút tiền
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
                <Icon name="close-circle" size={28} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
              {/* Available Balance */}
              <View className="bg-teal-50 p-4 rounded-2xl mt-4 mb-5 border border-teal-100">
                <Text variant="labelMedium" className="text-teal-600 font-medium mb-1">
                  Số dư khả dụng
                </Text>
                <Text variant="headlineSmall" className="text-teal-800 font-black">
                  {formatCurrency(currentBalance)}đ
                </Text>
              </View>

              {/* Amount Input */}
              <Text variant="labelLarge" className="text-slate-700 font-bold mb-2">
                Số tiền muốn rút <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1 mb-3">
                <Icon name="cash" size={22} color="#94a3b8" />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900 font-semibold py-3"
                  placeholder="Nhập số tiền"
                  placeholderTextColor="#94a3b8"
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                />
                <Text variant="labelLarge" className="text-slate-400 font-bold">đ</Text>
              </View>

              {/* Quick Amount Buttons */}
              <View className="flex-row flex-wrap gap-2 mb-5">
                {quickAmounts.map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => handleQuickAmount(val)}
                    activeOpacity={0.7}
                    className="px-4 py-2 rounded-xl border"
                    style={{
                      backgroundColor: parseAmount(amount) === val ? '#f0fdfa' : '#f8fafc',
                      borderColor: parseAmount(amount) === val ? '#0f766e' : '#e2e8f0',
                    }}
                  >
                    <Text
                      variant="labelMedium"
                      style={{ color: parseAmount(amount) === val ? '#0f766e' : '#64748b' }}
                      className="font-bold"
                    >
                      {formatCurrency(val)}đ
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Bank Name */}
              <Text variant="labelLarge" className="text-slate-700 font-bold mb-2">
                Tên ngân hàng
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1 mb-4">
                <Icon name="bank" size={22} color="#94a3b8" />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900 py-3"
                  placeholder="VD: Vietcombank, MB Bank..."
                  placeholderTextColor="#94a3b8"
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>

              {/* Bank Account Number */}
              <Text variant="labelLarge" className="text-slate-700 font-bold mb-2">
                Số tài khoản
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1 mb-4">
                <Icon name="credit-card-outline" size={22} color="#94a3b8" />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900 py-3"
                  placeholder="Nhập số tài khoản ngân hàng"
                  placeholderTextColor="#94a3b8"
                  value={bankAccountNumber}
                  onChangeText={setBankAccountNumber}
                  keyboardType="numeric"
                />
              </View>

              {/* Description */}
              <Text variant="labelLarge" className="text-slate-700 font-bold mb-2">
                Ghi chú
              </Text>
              <View className="flex-row items-start bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1 mb-6">
                <Icon name="note-text-outline" size={22} color="#94a3b8" style={{ marginTop: 14 }} />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900 py-3"
                  placeholder="Nhập ghi chú (tuỳ chọn)"
                  placeholderTextColor="#94a3b8"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Summary */}
              {numericAmount > 0 && (
                <View className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text variant="bodyMedium" className="text-slate-500 font-medium">Số tiền rút</Text>
                    <Text variant="titleSmall" className="text-slate-900 font-black">
                      {formatCurrency(numericAmount)}đ
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text variant="bodyMedium" className="text-slate-500 font-medium">Số dư còn lại</Text>
                    <Text
                      variant="titleSmall"
                      className="font-black"
                      style={{ color: currentBalance - numericAmount >= 0 ? '#059669' : '#dc2626' }}
                    >
                      {formatCurrency(currentBalance - numericAmount)}đ
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Actions */}
            <View className="flex-row gap-3 px-6 pt-4 pb-8 border-t border-gray-100">
              <TouchableOpacity
                className="flex-1 bg-gray-100 py-4 rounded-2xl items-center justify-center"
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text variant="titleSmall" className="text-gray-600 font-bold">Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-4 rounded-2xl items-center justify-center"
                style={{
                  backgroundColor: isValidAmount ? '#0f766e' : '#cbd5e1',
                }}
                onPress={handleWithdraw}
                activeOpacity={0.7}
                disabled={!isValidAmount || withdrawMutation.isPending}
              >
                <Text style={{ color: '#FFFFFF' }} variant="titleSmall" className="font-bold">
                  {withdrawMutation.isPending ? 'Đang xử lý...' : 'Xác nhận rút tiền'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
          duration={3000}
          style={{
            backgroundColor: snackbar.type === 'success' ? '#0f766e' : '#ef4444',
          }}
          action={{
            label: 'Đóng',
            textColor: '#fff',
            onPress: () => setSnackbar(prev => ({ ...prev, visible: false })),
          }}
        >
          {snackbar.message}
        </Snackbar>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
