import React, { memo, useCallback } from 'react';
import { View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Typography, Badge, Box } from '@components/ui';
import { formatDate, formatCurrency } from '@utils/helpers';
import type { Shipment, ShipmentStatus } from '../types/shipping.types';

interface ShipmentCardNWProps {
  shipment: Shipment;
  onPress?: (shipment: Shipment) => void;
}

const statusConfig: Record<
  ShipmentStatus,
  { icon: string; variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error'; label: string }
> = {
  pending: { icon: 'clock-outline', variant: 'warning', label: 'Pending' },
  confirmed: { icon: 'check-circle-outline', variant: 'primary', label: 'Confirmed' },
  picked_up: { icon: 'package-up', variant: 'success', label: 'Picked Up' },
  in_transit: { icon: 'truck-delivery', variant: 'secondary', label: 'In Transit' },
  out_for_delivery: { icon: 'map-marker', variant: 'secondary', label: 'Out for Delivery' },
  delivered: { icon: 'check-all', variant: 'success', label: 'Delivered' },
  cancelled: { icon: 'close-circle', variant: 'error', label: 'Cancelled' },
  returned: { icon: 'keyboard-return', variant: 'warning', label: 'Returned' },
};

function ShipmentCardNWComponent({ shipment, onPress }: ShipmentCardNWProps) {
  const status = statusConfig[shipment.status];

  const handlePress = useCallback(() => {
    onPress?.(shipment);
  }, [onPress, shipment]);

  return (
    <Card
      variant="elevated"
      className="mb-4"
      onPress={onPress ? handlePress : undefined}>
      {/* Header */}
      <Box className="flex-row justify-between items-center mb-4">
        <Typography variant="h6" className="font-semibold">
          {shipment.trackingNumber}
        </Typography>
        <Badge
          label={status.label}
          variant={status.variant}
          size="sm"
          icon={<Icon name={status.icon} size={14} color="currentColor" />}
        />
      </Box>

      {/* Address Timeline */}
      <Box className="mb-4">
        {/* From */}
        <Box className="flex-row items-start">
          <View className="w-2.5 h-2.5 rounded-full bg-primary-500 mt-1.5 mr-3" />
          <Box className="flex-1">
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              From
            </Typography>
            <Typography variant="body2" numberOfLines={1}>
              {shipment.sender.fullName} - {shipment.sender.city}
            </Typography>
          </Box>
        </Box>

        {/* Line */}
        <View className="w-0.5 h-4 bg-gray-200 dark:bg-gray-700 ml-1 my-0.5" />

        {/* To */}
        <Box className="flex-row items-start">
          <View className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 mr-3" />
          <Box className="flex-1">
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              To
            </Typography>
            <Typography variant="body2" numberOfLines={1}>
              {shipment.receiver.fullName} - {shipment.receiver.city}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer Stats */}
      <Box className="flex-row justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <Box className="items-center">
          <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
            Items
          </Typography>
          <Typography variant="body2" className="font-semibold">
            {shipment.items.length}
          </Typography>
        </Box>

        <Box className="items-center">
          <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
            Weight
          </Typography>
          <Typography variant="body2" className="font-semibold">
            {shipment.totalWeight} kg
          </Typography>
        </Box>

        <Box className="items-center">
          <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
            Amount
          </Typography>
          <Typography variant="body2" className="font-semibold text-primary-500">
            {formatCurrency(shipment.totalAmount)}
          </Typography>
        </Box>
      </Box>

      {/* Estimated Delivery */}
      {shipment.estimatedDelivery && (
        <Box className="mt-3 items-center">
          <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
            Est. delivery: {formatDate(shipment.estimatedDelivery)}
          </Typography>
        </Box>
      )}
    </Card>
  );
}

export const ShipmentCardNW = memo(ShipmentCardNWComponent);
