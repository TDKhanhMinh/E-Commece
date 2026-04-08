export type DriverStatus = 'online' | 'offline';

export type OrderStatus =
  | 'accepted'    // nhận đơn, chưa bắt đầu
  | 'picking_up'  // đang đến lấy hàng
  | 'delivering'  // đang giao hàng
  | 'completed'   // hoàn thành
  | 'cancelled';  // đã huỷ

export type CargoType = 'food' | 'document' | 'package' | 'fragile' | 'bulky';

export type PaymentMethod = 'cash' | 'card' | 'wallet';

export interface DriverStats {
  earningsToday: number;
  completedToday: number;
  rating: number;
  weeklyEarnings: number[]; // 7 days Mon-Sun
}

export interface Order {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDistanceKm: number;
  deliveryDistanceKm: number;
  estimatedMinutes: number;
  fee: number;
  cargoType: CargoType;
  customerName: string;
  customerPhone: string;
  note?: string;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
}

/** Full detail – used on the detail screen */
export interface OrderDetail extends Order {
  senderName: string;     // pickup contact (shop / sender)
  senderPhone: string;
  senderNote?: string;    // special note from sender
  receiverNote?: string;  // note from receiver (same as `note` but kept explicit)
  items: OrderItem[];
  orderTotal: number;     // full order value
  codAmount?: number;     // amount driver needs to collect (COD)
  paymentMethod: PaymentMethod;
}

export interface ActiveOrder {
  detail: OrderDetail;
  status: OrderStatus;
  acceptedAt: Date;
  startedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}

// ── Legacy types kept for compatibility ──────────────────────────────────────
export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
}

export interface DashboardStats {
  totalShipments: number;
  pendingShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'promotion';
  imageUrl?: string;
  actionUrl?: string;
  expiresAt: Date;
}
