import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@styles/index';
import { useDriverStore } from '../store/useDriverStore';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

export function HomeHeader({ onNotificationPress, onAvatarPress }: HomeHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { status, toggleStatus } = useDriverStore();

  const isOnline = status === 'online';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          paddingTop: insets.top + spacing.sm,
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
    >
      {/* Logo + App name */}
      <View style={styles.logoRow}>
        <View style={[styles.logoBox, { backgroundColor: theme.colors.primary }]}>
          <Icon name="truck-fast" size={20} color="#FFFFFF" />
        </View>
        <Text variant="titleMedium" style={[styles.appName, { color: theme.colors.onSurface }]}>
          Giao Hàng Việt
        </Text>
      </View>

      {/* Right actions */}
      <View style={styles.rightRow}>
        {/* Online/Offline toggle */}
        <TouchableOpacity
          style={[
            styles.statusChip,
            { backgroundColor: isOnline ? '#E8F5E9' : theme.colors.surfaceVariant },
          ]}
          onPress={toggleStatus}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isOnline ? '#4CAF50' : theme.colors.outline },
            ]}
          />
          <Text
            variant="labelSmall"
            style={{ color: isOnline ? '#2E7D32' : theme.colors.onSurfaceVariant, fontWeight: '700' }}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>

        {/* Bell */}
        <TouchableOpacity style={styles.iconBtn} onPress={onNotificationPress}>
          <Icon name="bell-outline" size={22} color={theme.colors.onSurface} />
          <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
            <Text variant="labelSmall" style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        {/* Avatar */}
        <TouchableOpacity style={styles.avatarBtn} onPress={onAvatarPress}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
            <Icon name="account" size={20} color={theme.colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '700',
  },
  avatarBtn: {
    marginLeft: 2,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
