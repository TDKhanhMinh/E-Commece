import type { BaseEntity, Nullable } from '@types/common.types';

export type ShipmentStatus =
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ShipmentItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  description?: string;
}

export interface TrackingEvent {
  id: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: Date;
}

export interface Shipment extends BaseEntity {
  trackingNumber: string;
  status: ShipmentStatus;
  sender: Address;
  receiver: Address;
  items: ShipmentItem[];
  totalWeight: number;
  shippingFee: number;
  insuranceFee: number;
  totalAmount: number;
  estimatedDelivery: Nullable<Date>;
  actualDelivery: Nullable<Date>;
  trackingHistory: TrackingEvent[];
  notes?: string;
}

export interface CreateShipmentData {
  sender: Address;
  receiver: Address;
  items: Omit<ShipmentItem, 'id'>[];
  notes?: string;
  insuranceRequired: boolean;
}

export interface ShipmentFilters {
  status?: ShipmentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}
