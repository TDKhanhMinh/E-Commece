import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, borderRadius } from '@styles/index';
import { useDriverStore } from '../store/useDriverStore';

// ── Mini bar chart (7 bars) ─────────────────────────────────────────────────
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <View style={chartStyles.container}>
      {data.map((val, i) => (
        <View key={i} style={chartStyles.barCol}>
          <View style={chartStyles.barTrack}>
            <View
              style={[
                chartStyles.bar,
                {
                  height: `${(val / max) * 100}%`,
                  backgroundColor: i === data.length - 1 ? color : color + '66',
                },
              ]}
            />
          </View>
          <Text style={[chartStyles.label, { color: '#9E9E9E' }]}>{days[i]}</Text>
        </View>
      ))}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 48,
    marginTop: spacing.xs,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  bar: {
    width: '100%',
    borderRadius: 2,
  },
  label: {
    fontSize: 8,
    fontWeight: '500',
  },
});

// ── Stat tile ───────────────────────────────────────────────────────────────
interface StatTileProps {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
}

function StatTile({ icon, label, value, iconColor }: StatTileProps) {
  const theme = useTheme();
  return (
    <View style={tileStyles.tile}>
      <View style={[tileStyles.iconBox, { backgroundColor: iconColor + '20' }]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>
      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text variant="titleMedium" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
        {value}
      </Text>
    </View>
  );
}

const tileStyles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});

// ── Main widget ─────────────────────────────────────────────────────────────
export function StatsWidget() {
  const theme = useTheme();
  const stats = useDriverStore((s) => s.stats);

  const earningsFormatted = new Intl.NumberFormat('vi-VN').format(stats.earningsToday) + 'đ';

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={2}>
      {/* Top row */}
      <View style={styles.statsRow}>
        <StatTile
          icon="cash-multiple"
          label="Thu nhập hôm nay"
          value={earningsFormatted}
          iconColor="#4CAF50"
        />
        <View style={styles.divider} />
        <StatTile
          icon="check-circle-outline"
          label="Đơn hoàn thành"
          value={`${stats.completedToday} đơn`}
          iconColor={theme.colors.primary}
        />
        <View style={styles.divider} />
        <StatTile
          icon="star"
          label="Đánh giá"
          value={`${stats.rating} ★`}
          iconColor="#FF9800"
        />
      </View>

      {/* Chart */}
      <View style={styles.chartSection}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 2 }}>
          Thu nhập 7 ngày qua
        </Text>
        <MiniBarChart data={stats.weeklyEarnings} color={theme.colors.primary} />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: '#E0E0E0',
    marginHorizontal: spacing.xs,
  },
  chartSection: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: spacing.sm,
  },
});
