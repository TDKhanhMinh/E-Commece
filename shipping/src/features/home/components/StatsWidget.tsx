import React from 'react';
import { View } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDriverStore } from '../store/useDriverStore';

// ── Mini bar chart (7 bars) ─────────────────────────────────────────────────
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <View className="flex-row items-end justify-between h-[60px]">
      {data.map((val, i) => {
        const isToday = i === data.length - 1;
        return (
          <View key={i} className="items-center flex-1 h-full">
            <View className="flex-1 w-2.5 justify-end items-center mb-1.5">
              <View
                className="w-full rounded-full"
                style={{
                  height: `${Math.max((val / max) * 100, 10)}%`, // At least 10% height for visibility
                  backgroundColor: isToday ? color : '#E5E7EB', // Highlight today with primary, others gray
                }}
              />
            </View>
            <Text
              className={`text-[9px] font-bold ${isToday ? 'text-gray-800' : 'text-gray-400'}`}
            >
              {days[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Stat tile ───────────────────────────────────────────────────────────────
interface StatTileProps {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
  bgColorClass: string;
}

function StatTile({ icon, label, value, iconColor, bgColorClass }: StatTileProps) {
  return (
    <View className="flex-1 flex-row items-center gap-3">
      <View className={`w-10 h-10 rounded-full items-center justify-center ${bgColorClass}`}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <View>
        <Text className="text-gray-500 font-medium text-[11px] mb-0.5">{label}</Text>
        <Text className="text-gray-900 font-bold text-[15px]">{value}</Text>
      </View>
    </View>
  );
}

// ── Main widget ─────────────────────────────────────────────────────────────
export function StatsWidget() {
  const stats = useDriverStore((s) => s.stats);
  const theme = useTheme();

  const earningsFormatted = new Intl.NumberFormat('vi-VN').format(stats.earningsToday) + 'đ';

  return (
    <Surface
      className="mx-4 mt-4 rounded-3xl overflow-hidden bg-white border border-gray-100"
      style={[{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }]}
    >
      {/* ── Nửa trên (Màu nổi): Thu nhập ── */}
      <View className="p-5 pb-8 relative overflow-hidden" style={{ backgroundColor: theme.colors.primary }}>
        {/* Background shapes for decoration */}
        <View className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white opacity-10" />
        <View className="absolute -left-12 -bottom-12 w-28 h-28 rounded-full bg-black opacity-10" />

        <View className="flex-row justify-between items-start">
          <View>
            <Text style={{ color: '#FFFFFF' }} className="text-white/80 font-medium text-xs tracking-wide mb-1 uppercase">
              Thu nhập trong ngày
            </Text>
            <Text style={{ color: '#FFFFFF' }} className="text-[28px] font-black text-white tracking-tight">
              {earningsFormatted}
            </Text>
          </View>
          <View className="bg-white/20 p-2.5 rounded-[12px]">
            <Icon name="wallet-giftcard" size={24} color="#FFF" />
          </View>
        </View>
      </View>

      {/* ── Nửa dưới (Màu Trắng): Các thống kê phụ và biểu đồ ── */}
      <View className="bg-white px-5 py-5 rounded-t-3xl -mt-5">
        {/* Chỉ số phụ */}
        <View className="flex-row justify-between items-center mb-5">
          <StatTile
            icon="check-decagram"
            label="Hoàn thành"
            value={`${stats.completedToday} đơn`}
            iconColor="#2563EB"
            bgColorClass="bg-blue-50"
          />
          <View className="w-[1px] h-8 bg-gray-200 mx-2" />
          <StatTile
            icon="star"
            label="Đánh giá"
            value={`${stats.rating.toFixed(1)} ★`}
            iconColor="#D97706"
            bgColorClass="bg-amber-50"
          />
        </View>

        {/* Biểu đồ */}
        <View className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/60">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-900 font-bold text-sm tracking-tight">Thống kê 7 ngày</Text>
            <Text className="text-gray-400 font-medium text-[10px] uppercase tracking-widest">Gần nhất</Text>
          </View>
          <MiniBarChart data={stats.weeklyEarnings} color={theme.colors.primary} />
        </View>
      </View>
    </Surface>
  );
}

