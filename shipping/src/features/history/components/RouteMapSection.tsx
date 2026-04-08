import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { HistoryOrder } from '../types';

interface RouteMapSectionProps {
  order: HistoryOrder;
  isLoading?: boolean;
}

export const RouteMapSection = ({
  order,
  isLoading = false,
}: RouteMapSectionProps) => {
  const theme = useTheme();

  if (!order.route) {
    return null;
  }

  const { route } = order;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      {/* Map Placeholder */}
      <View
        style={[
          styles.mapContainer,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.mapPlaceholder}>
            {/* Simple visual representation of route */}
            <View style={styles.routeVisualization}>
              {/* Start point */}
              <View style={styles.routePointGroup}>
                <View
                  style={[
                    styles.routePointCircle,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Icon
                    name="map-marker"
                    size={16}
                    color={theme.colors.onPrimary}
                  />
                </View>
                <Text
                  variant="labelSmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 4,
                  }}
                >
                  Lấy hàng
                </Text>
              </View>

              {/* Route line */}
              <View style={styles.routeLineLong} />

              {/* End point */}
              <View style={styles.routePointGroup}>
                <View
                  style={[
                    styles.routePointCircle,
                    { backgroundColor: theme.colors.tertiary },
                  ]}
                >
                  <Icon
                    name="map-marker"
                    size={16}
                    color={theme.colors.onTertiary}
                  />
                </View>
                <Text
                  variant="labelSmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 4,
                  }}
                >
                  Giao hàng
                </Text>
              </View>
            </View>

            {/* Route Info */}
            <View style={styles.routeInfoBox}>
              <View style={styles.routeInfoItem}>
                <Icon
                  name="map-marker-distance"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  variant="bodySmall"
                  style={{
                    marginLeft: 8,
                    color: theme.colors.onSurface,
                  }}
                >
                  {route.distance.toFixed(1)} km
                </Text>
              </View>
              <View style={styles.routeInfoDivider} />
              <View style={styles.routeInfoItem}>
                <Icon
                  name="clock-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  variant="bodySmall"
                  style={{
                    marginLeft: 8,
                    color: theme.colors.onSurface,
                  }}
                >
                  {route.duration} phút
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Address Details */}
      <View style={styles.addressSection}>
        {/* Start Address */}
        <View style={styles.addressBlock}>
          <View
            style={[
              styles.addressIcon,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Icon
              name="package-variant"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.addressContent}>
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.outline }}
            >
              ĐỊA ĐIỂM LẤY HÀNG
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurface,
                fontWeight: '600',
                marginTop: 4,
              }}
            >
              {route.startPoint.fullName}
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginTop: 2,
              }}
              numberOfLines={2}
            >
              {route.startPoint.street}, {route.startPoint.ward},
              {route.startPoint.district}
            </Text>
            {route.startPoint.phone && (
              <Text
                variant="labelSmall"
                style={{
                  color: theme.colors.primary,
                  marginTop: 4,
                }}
              >
                {route.startPoint.phone}
              </Text>
            )}
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.addressDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        {/* End Address */}
        <View style={styles.addressBlock}>
          <View
            style={[
              styles.addressIcon,
              { backgroundColor: theme.colors.tertiaryContainer },
            ]}
          >
            <Icon
              name="home-marker"
              size={20}
              color={theme.colors.tertiary}
            />
          </View>
          <View style={styles.addressContent}>
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.outline }}
            >
              ĐỊA ĐIỂM GIAO HÀNG
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurface,
                fontWeight: '600',
                marginTop: 4,
              }}
            >
              {route.endPoint.fullName}
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginTop: 2,
              }}
              numberOfLines={2}
            >
              {route.endPoint.street}, {route.endPoint.ward},
              {route.endPoint.district}
            </Text>
            {route.endPoint.phone && (
              <Text
                variant="labelSmall"
                style={{
                  color: theme.colors.primary,
                  marginTop: 4,
                }}
              >
                {route.endPoint.phone}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mapContainer: {
    height: 240,
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  routeVisualization: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  routePointGroup: {
    alignItems: 'center',
  },
  routePointCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeLineLong: {
    width: 2,
    height: 40,
    backgroundColor: '#BDBDBD',
    marginVertical: 8,
  },
  routeInfoBox: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  routeInfoDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
  },
  addressSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  addressBlock: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressDivider: {
    height: 1,
    marginVertical: 12,
  },
});
