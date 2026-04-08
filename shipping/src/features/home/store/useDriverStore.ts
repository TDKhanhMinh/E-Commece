import { createStore } from '@core/store/createStore';
import type {
  DriverStatus,
  DriverStats,
  Order,
  OrderDetail,
  ActiveOrder,
  OrderStatus,
} from '../types/home.types';

// ── Mock data ──────────────────────────────────────────────────────────────
const mockStats: DriverStats = {
  earningsToday: 320000,
  completedToday: 12,
  rating: 4.9,
  weeklyEarnings: [180000, 250000, 310000, 195000, 420000, 290000, 320000],
};

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    pickupAddress: '25 Lê Duẩn, Quận 1, TP.HCM',
    dropoffAddress: '147 Hai Bà Trưng, Quận 3, TP.HCM',
    pickupDistanceKm: 0.8,
    deliveryDistanceKm: 2.3,
    estimatedMinutes: 12,
    fee: 25000,
    cargoType: 'food',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901234567',
    note: 'Giao trước 11:30, gọi trước khi đến',
    createdAt: new Date(),
  },
  {
    id: 'ORD-002',
    pickupAddress: '65 Nguyễn Huệ, Quận 1, TP.HCM',
    dropoffAddress: '89 Phan Xích Long, Bình Thạnh, TP.HCM',
    pickupDistanceKm: 1.2,
    deliveryDistanceKm: 4.1,
    estimatedMinutes: 18,
    fee: 38000,
    cargoType: 'document',
    customerName: 'Trần Thị Bích',
    customerPhone: '0912345678',
    createdAt: new Date(),
  },
  {
    id: 'ORD-003',
    pickupAddress: '10 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM',
    dropoffAddress: '45 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',
    pickupDistanceKm: 0.5,
    deliveryDistanceKm: 1.8,
    estimatedMinutes: 9,
    fee: 18000,
    cargoType: 'package',
    customerName: 'Lê Minh Khoa',
    customerPhone: '0987654321',
    note: 'Hàng dễ vỡ, cẩn thận',
    createdAt: new Date(),
  },
  {
    id: 'ORD-004',
    pickupAddress: '200 Nguyễn Thị Minh Khai, Q3, TP.HCM',
    dropoffAddress: '78 Cách Mạng Tháng 8, Q10, TP.HCM',
    pickupDistanceKm: 2.1,
    deliveryDistanceKm: 3.5,
    estimatedMinutes: 22,
    fee: 45000,
    cargoType: 'bulky',
    customerName: 'Phạm Quốc Hùng',
    customerPhone: '0776543210',
    createdAt: new Date(),
  },
];

/** Build a full OrderDetail from a base Order + extra mock fields */
function buildOrderDetail(order: Order): OrderDetail {
  const itemSets: Record<string, { name: string; quantity: number; price: number }[]> = {
    food: [
      { name: 'Bún chả đặc biệt', quantity: 2, price: 55000 },
      { name: 'Nem cua bể', quantity: 1, price: 40000 },
    ],
    document: [
      { name: 'Tài liệu A4 (bộ)', quantity: 1, price: 0 },
    ],
    package: [
      { name: 'Hộp quà sinh nhật', quantity: 1, price: 150000 },
    ],
    fragile: [
      { name: 'Lọ thuỷ tinh', quantity: 2, price: 85000 },
    ],
    bulky: [
      { name: 'Thùng hàng XL', quantity: 1, price: 320000 },
    ],
  };

  const rawItems = itemSets[order.cargoType] ?? itemSets.package;
  const items = rawItems.map((it, idx) => ({ id: `${order.id}-ITEM-${idx}`, ...it }));
  const orderTotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return {
    ...order,
    senderName: 'Bún chả Bà Lan',
    senderPhone: '0281234567',
    senderNote: 'Lấy thêm ớt bột cho khách.',
    receiverNote: order.note,
    items,
    orderTotal,
    codAmount: orderTotal > 0 ? orderTotal : undefined,
    paymentMethod: 'cash',
  } as OrderDetail;
}

// One pre-seeded active order (status: delivering) for demo
const mockActiveOrder: ActiveOrder = {
  detail: buildOrderDetail(mockOrders[0]),
  status: 'delivering',
  acceptedAt: new Date(Date.now() - 25 * 60 * 1000),
  startedAt: new Date(Date.now() - 20 * 60 * 1000),
  pickedUpAt: new Date(Date.now() - 8 * 60 * 1000),
};

// ── Store ──────────────────────────────────────────────────────────────────
interface DriverState {
  status: DriverStatus;
  stats: DriverStats;
  availableOrders: Order[];
  activeOrders: ActiveOrder[];
}

interface DriverActions {
  toggleStatus: () => void;
  acceptOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setOrders: (orders: Order[]) => void;
  getActiveOrder: (orderId: string) => ActiveOrder | undefined;
  getOrderDetail: (orderId: string) => OrderDetail | undefined;
}

type DriverStore = DriverState & DriverActions;

const initialState: DriverState = {
  status: 'online',
  stats: mockStats,
  availableOrders: mockOrders.slice(1), // ORD-001 is already active
  activeOrders: [mockActiveOrder],
};

export const useDriverStore = createStore<DriverStore>(
  (set, get) => ({
    ...initialState,

    toggleStatus: () =>
      set((state) => ({
        status: state.status === 'online' ? 'offline' : 'online',
      })),

    acceptOrder: (orderId) => {
      const order = get().availableOrders.find((o) => o.id === orderId);
      if (!order) return;

      const newActive: ActiveOrder = {
        detail: buildOrderDetail(order),
        status: 'accepted',
        acceptedAt: new Date(),
      };

      set((state) => ({
        availableOrders: state.availableOrders.filter((o) => o.id !== orderId),
        activeOrders: [...state.activeOrders, newActive],
      }));
    },

    updateOrderStatus: (orderId, status) =>
      set((state) => ({
        activeOrders: state.activeOrders.map((ao) => {
          if (ao.detail.id !== orderId) return ao;
          const now = new Date();
          return {
            ...ao,
            status,
            ...(status === 'picking_up' && !ao.startedAt ? { startedAt: now } : {}),
            ...(status === 'delivering' && !ao.pickedUpAt ? { pickedUpAt: now } : {}),
            ...(status === 'completed' && !ao.deliveredAt ? { deliveredAt: now } : {}),
          };
        }),
        stats:
          status === 'completed'
            ? {
                ...state.stats,
                completedToday: state.stats.completedToday + 1,
                earningsToday:
                  state.stats.earningsToday +
                  (state.activeOrders.find((o) => o.detail.id === orderId)?.detail.fee ?? 0),
              }
            : state.stats,
      })),

    setOrders: (orders) => set({ availableOrders: orders }),

    getActiveOrder: (orderId) =>
      get().activeOrders.find((ao) => ao.detail.id === orderId),

    getOrderDetail: (orderId) =>
      get().activeOrders.find((ao) => ao.detail.id === orderId)?.detail,
  }),
  { name: 'driver-store' },
);
