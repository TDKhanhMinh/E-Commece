import React from 'react';
import { View } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing } from '@styles/index';
import { Pressable } from 'react-native';

export function BalanceCard() {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <View className="bg-[#0f766e] p-6 rounded-[32px] shadow-2xl overflow-hidden border border-white/10 mx-4">
      {/* Background decoration - Abstract shapes */}
      <View className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full" />
      <View className="absolute -bottom-24 -left-12 w-64 h-64 bg-teal-400/20 rounded-full" />
      <View className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full" />

      <View className="items-center z-10">
        <View className="flex-row items-center mb-2">
          <Typography variant="body2" className="text-teal-100 font-medium mr-2">
            Số dư khả dụng
          </Typography>
          <Pressable onPress={() => setIsVisible(!isVisible)} hitSlop={10}>
            <Icon
              name={isVisible ? "eye-outline" : "eye-off-outline"}
              size={18}
              color="#ccfbf1"
            />
          </Pressable>
        </View>

        <View className="flex-row items-end mb-4">
          <Typography variant="h2" className="text-white font-bold text-5xl leading-tight">
            {isVisible ? "2.500.000" : "••••••••"}
          </Typography>
          <Typography variant="h5" className="text-teal-200 font-bold mb-2 ml-1">
            đ
          </Typography>
        </View>

        <View className="bg-white/10 px-4 py-1.5 rounded-full mb-2">
          <Typography variant="caption" className="text-teal-50 font-semibold">
            Ví Thu Hộ (COD): {isVisible ? "550.000 đ" : "•••• đ"}
          </Typography>
        </View>
      </View>

      <View className="flex-row justify-between mt-6 pt-6 border-t border-white/40 z-10">
        <ActionButton
          icon="wallet-plus"
          label="Nạp tiền"
          onPress={() => console.log('Top up')}
        />
        <View className="w-[1px] h-10 bg-white/20 self-center" />
        <ActionButton
          icon="bank-transfer-out"
          label="Rút tiền"
          onPress={() => console.log('Withdraw')}
        />
      </View>
    </View>
  );
}

function ActionButton({ icon, label, onPress }: { icon: string, label: string, onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-2 py-2"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }]
      })}
    >
      <View className="w-10 h-10 bg-white/20 rounded-2xl items-center justify-center">
        <Icon name={icon} size={22} color="#FFF" />
      </View>
      <Typography variant="body2" className="text-white font-bold tracking-wide">
        {label}
      </Typography>
    </Pressable>
  );
}
