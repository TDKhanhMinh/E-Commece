import type { BaseEntity, Nullable } from '@shared/types/common.types';
import type { Address, ShipmentItem } from '@features/shipping/types/shipping.types';

export type OrderStatus = 'completed' | 'cancelled' | 'returned';

export interface CustomerRating extends BaseEntity {
  orderId: string;
  rating: number; // 1-5 stars
  comment: Nullable<string>;
  createdAt: Date;
  ratedBy: string; // customer name
}

export interface HistoryOrder extends BaseEntity {
  shipmentId: string;
  trackingNumber: string;
  status: OrderStatus;
  sender: Address;
  receiver: Address;
  items: ShipmentItem[];
  totalAmount: number;
  shippingFee: number;
  insuranceFee: number;
  serviceFee: number;
  income: number; // what driver earned
  driverIncome: number; // actual income received by driver
  deliveredAt: Date;
  pickedUpAt: Date;
  customerRating: Nullable<CustomerRating>;
  route?: {
    distance: number; // in km
    duration: number; // in minutes
    startPoint: Address;
    endPoint: Address;
  };
  itemType?: 'food' | 'goods' | 'document'; // for icon differentiation
}

export interface HistoryFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string; // trackingNumber, customer name, or address
}

export type DateRangeFilter = 'today' | 'week' | 'month' | 'all';

export interface HistorySummary {
  totalOrders: number;
  totalIncome: number;
  averageRating: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface ReportIssueData {
  orderId: string;
  issueType: 'wrong_address' | 'missing_items' | 'damaged_items' | 'customer_complaint' | 'other';
  description: string;
  evidence?: string[]; // photo URLs
}
