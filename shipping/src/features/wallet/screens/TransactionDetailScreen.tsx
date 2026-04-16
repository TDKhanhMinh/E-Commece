import React from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { WalletStackParamList } from '@navigation/types';

type TransactionDetailRouteProp = RouteProp<WalletStackParamList, 'TransactionDetail'>;

const ACTION_LABELS: Record<string, string> = {
  DELIVERY_FEE: 'Cước giao hàng',
  COD_COLLECTION: 'Thu hộ COD',
  WITHDRAWAL: 'Rút tiền',
  TOP_UP: 'Nạp tiền',
  REFUND: 'Hoàn tiền',
  BONUS: 'Thưởng',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  SUCCESS: { label: 'Thành công', color: '#059669', bg: '#ecfdf5', icon: 'check-circle' },
  PENDING: { label: 'Đang xử lý', color: '#d97706', bg: '#fffbeb', icon: 'clock-outline' },
  FAILED: { label: 'Thất bại', color: '#dc2626', bg: '#fef2f2', icon: 'close-circle' },
  REJECTED: { label: 'Bị từ chối', color: '#9333ea', bg: '#faf5ff', icon: 'cancel' },
};

export function TransactionDetailScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<TransactionDetailRouteProp>();
  const { transaction } = route.params;

  const isIncoming = transaction.type === 'CREDIT';
  const amount = Math.abs(parseFloat(transaction.amount));
  const formattedAmount = amount.toLocaleString('vi-VN');
  const actionLabel = ACTION_LABELS[transaction.transactionAction] || transaction.transactionAction;
  const statusConfig = STATUS_CONFIG[transaction.transactionStatus] || STATUS_CONFIG.PENDING;
  const createdDate = new Date(transaction.createdAt);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-[#0f766e]"
      >
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
          >
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text variant="titleLarge" style={{ color: '#fff' }} className="font-bold">
            Chi tiết giao dịch
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
      >
        {/* Amount Hero */}
        <View className="bg-[#0f766e] items-center pb-10 pt-4 rounded-b-[32px]">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: isIncoming ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)' }}
          >
            <Icon
              name={isIncoming ? 'arrow-down-bold-circle' : 'arrow-up-bold-circle'}
              size={42}
              color="#fff"
            />
          </View>

          <Text variant="bodyMedium" style={{ color: '#ccfbf1' }} className="font-medium mb-1">
            {isIncoming ? 'Tiền vào' : 'Tiền ra'}
          </Text>

          <View className="flex-row items-end">
            <Text
              variant="displaySmall"
              style={{ color: '#fff' }}
              className="font-black"
            >
              {isIncoming ? '+' : '-'}{formattedAmount}
            </Text>
            <Text variant="titleMedium" style={{ color: '#99f6e4' }} className="font-bold mb-1 ml-1">
              đ
            </Text>
          </View>

          {/* Status Badge */}
          <View
            className="flex-row items-center mt-4 px-5 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Icon name={statusConfig.icon} size={18} color="#fff" />
            <Text variant="labelLarge" style={{ color: '#fff' }} className="font-bold ml-2">
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View className="mx-4 -mt-4 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <Text variant="titleMedium" className="font-bold text-slate-900 mb-4">
            Thông tin giao dịch
          </Text>

          <DetailRow
            icon="identifier"
            label="Mã giao dịch"
            value={`#${transaction.transactionId}`}
          />

          <DetailRow
            icon="tag-outline"
            label="Loại giao dịch"
            value={actionLabel}
          />

          <DetailRow
            icon="swap-vertical"
            label="Phân loại"
            value={isIncoming ? 'Tiền vào (CREDIT)' : 'Tiền ra (DEBIT)'}
            valueColor={isIncoming ? '#059669' : '#dc2626'}
          />

          <DetailRow
            icon="check-decagram"
            label="Trạng thái"
            value={statusConfig.label}
            valueColor={statusConfig.color}
            isStatus
            statusBg={statusConfig.bg}
          />

          <DetailRow
            icon="calendar-clock"
            label="Thời gian"
            value={createdDate.toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          />

          <DetailRow
            icon="cash"
            label="Số tiền"
            value={`${isIncoming ? '+' : '-'}${formattedAmount} đ`}
            valueColor={isIncoming ? '#059669' : '#dc2626'}
            isLast
          />
        </View>

        {/* Description Card */}
        {transaction.description && (
          <View className="mx-4 mt-4 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <Icon name="note-text-outline" size={20} color="#64748b" />
              <Text variant="titleMedium" className="font-bold text-slate-900 ml-2">
                Ghi chú
              </Text>
            </View>
            <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Text variant="bodyMedium" className="text-slate-700 leading-6">
                {transaction.description}
              </Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <Icon name="timeline-clock-outline" size={20} color="#64748b" />
            <Text variant="titleMedium" className="font-bold text-slate-900 ml-2">
              Lịch sử trạng thái
            </Text>
          </View>

          <TimelineItem
            icon="plus-circle"
            label="Tạo giao dịch"
            time={createdDate.toLocaleString('vi-VN')}
            color="#3b82f6"
            isFirst
          />
          <TimelineItem
            icon={statusConfig.icon}
            label={statusConfig.label}
            time={createdDate.toLocaleString('vi-VN')}
            color={statusConfig.color}
            isLast
          />
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueColor,
  isStatus,
  statusBg,
  isLast,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
  isStatus?: boolean;
  statusBg?: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-3.5 ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <View className="flex-row items-center flex-1">
        <Icon name={icon} size={20} color="#94a3b8" />
        <Text variant="bodyMedium" className="text-slate-500 font-medium ml-2">
          {label}
        </Text>
      </View>
      {isStatus ? (
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: statusBg }}
        >
          <Text variant="labelMedium" style={{ color: valueColor }} className="font-bold">
            {value}
          </Text>
        </View>
      ) : (
        <Text
          variant="bodyMedium"
          style={valueColor ? { color: valueColor } : undefined}
          className={`font-bold ${!valueColor ? 'text-slate-900' : ''}`}
        >
          {value}
        </Text>
      )}
    </View>
  );
}

function TimelineItem({
  icon,
  label,
  time,
  color,
  isFirst,
  isLast,
}: {
  icon: string;
  label: string;
  time: string;
  color: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <View className="flex-row">
      <View className="items-center mr-3">
        <Icon name={icon} size={22} color={color} />
        {!isLast && <View className="w-0.5 flex-1 bg-gray-200 my-1" />}
      </View>
      <View className={`flex-1 ${!isLast ? 'pb-4' : ''}`}>
        <Text variant="bodyMedium" className="font-bold text-slate-800">
          {label}
        </Text>
        <Text variant="bodySmall" className="text-slate-400 mt-0.5">
          {time}
        </Text>
      </View>
    </View>
  );
}
