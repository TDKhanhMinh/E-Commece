import type { HistoryOrder, HistoryFilters, HistorySummary, ReportIssueData } from '../types';

// Mock service - replace with actual API calls
export const historyService = {
  /**
   * Fetch driver's order history with optional filters
   */
  async getOrderHistory(
    driverId: string,
    filters?: HistoryFilters,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ orders: HistoryOrder[]; total: number }> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/drivers/${driverId}/history`, { filters, limit, offset });
      
      // Mock data for demonstration
      const mockOrders = generateMockOrders(20);
      
      let filtered = mockOrders;
      
      if (filters?.status) {
        filtered = filtered.filter(order => order.status === filters.status);
      }
      
      if (filters?.dateFrom) {
        filtered = filtered.filter(order => new Date(order.deliveredAt) >= filters.dateFrom!);
      }
      
      if (filters?.dateTo) {
        filtered = filtered.filter(order => new Date(order.deliveredAt) <= filters.dateTo!);
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(order =>
          order.trackingNumber.toLowerCase().includes(searchLower) ||
          order.receiver.fullName.toLowerCase().includes(searchLower) ||
          order.receiver.street.toLowerCase().includes(searchLower)
        );
      }
      
      return {
        orders: filtered.slice(offset, offset + limit),
        total: filtered.length,
      };
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  },

  /**
   * Get summary statistics for a date range
   */
  async getHistorySummary(driverId: string, dateFrom?: Date, dateTo?: Date): Promise<HistorySummary> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/drivers/${driverId}/history/summary`, { dateFrom, dateTo });
      
      const { orders } = await this.getOrderHistory(driverId, { dateFrom, dateTo });
      
      const totalIncome = orders.reduce((sum, order) => sum + order.driverIncome, 0);
      const completedOrders = orders.filter(order => order.status === 'completed').length;
      const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
      
      const ratingsArray = orders
        .filter(order => order.customerRating)
        .map(order => order.customerRating!.rating);
      
      const averageRating = ratingsArray.length > 0
        ? ratingsArray.reduce((sum, rating) => sum + rating, 0) / ratingsArray.length
        : 0;
      
      return {
        totalOrders: orders.length,
        totalIncome,
        averageRating,
        completedOrders,
        cancelledOrders,
      };
    } catch (error) {
      console.error('Error fetching history summary:', error);
      throw error;
    }
  },

  /**
   * Get detailed information for a single order
   */
  async getOrderDetail(_orderId: string): Promise<HistoryOrder> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/orders/${_orderId}`);
      
      const orders = generateMockOrders(20);
      const order = orders[0];
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      console.error('Error fetching order detail:', error);
      throw error;
    }
  },

  /**
   * Report an issue with a completed order
   */
  async reportIssue(driverId: string, issueData: ReportIssueData): Promise<{ success: boolean; ticketId: string }> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post(`/drivers/${driverId}/issues`, issueData);
      
      const ticketId = `TICKET-${Date.now()}`;
      console.log('Issue reported:', { driverId, issueData, ticketId });
      
      return {
        success: true,
        ticketId,
      };
    } catch (error) {
      console.error('Error reporting issue:', error);
      throw error;
    }
  },

  /**
   * Fetch route history (coordinates for map)
   */
  async getRouteHistory(_orderId: string): Promise<any> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/orders/${_orderId}/route`);
      
      return {
        waypoints: [
          { latitude: 10.7769, longitude: 106.7009, name: 'Pick-up Point' },
          { latitude: 10.7895, longitude: 106.7088, name: 'Delivery Point' },
        ],
        polyline: [], // Encoded polyline for route
      };
    } catch (error) {
      console.error('Error fetching route history:', error);
      throw error;
    }
  },
};

// Helper function to generate mock orders
function generateMockOrders(count: number): HistoryOrder[] {
  const orders: HistoryOrder[] = [];
  const itemTypes: Array<'food' | 'goods' | 'document'> = ['food', 'goods', 'document'];
  const districts = ['Q.1', 'Q.2', 'Q.3', 'Q.4', 'Q.5', 'Q.7', 'Q.10', 'Bình Thạnh', 'Phú Nhuận'];

  for (let i = 0; i < count; i++) {
    const isCompleted = Math.random() > 0.2;
    const hasRating = isCompleted && Math.random() > 0.3;
    const startDistrict = districts[Math.floor(Math.random() * districts.length)];
    let endDistrict = districts[Math.floor(Math.random() * districts.length)];
    while (endDistrict === startDistrict) {
      endDistrict = districts[Math.floor(Math.random() * districts.length)];
    }

    const deliveredAt = new Date();
    deliveredAt.setDate(deliveredAt.getDate() - Math.floor(Math.random() * 30));

    const shippingFee = Math.floor(Math.random() * 50000) + 25000;
    const driverIncome = Math.floor(shippingFee * 0.7);

    orders.push({
      id: `order-${i + 1}`,
      trackingNumber: `#${2410 + Math.floor(Math.random() * 100)}-${String(i + 1).padStart(3, '0')}`,
      status: isCompleted ? 'completed' : 'cancelled',
      itemType: itemTypes[Math.floor(Math.random() * itemTypes.length)],
      sender: {
        fullName: `Người gửi ${i + 1}`,
        phone: '0912345678',
        street: `Đường số ${i + 1}`,
        ward: `Phường ${i + 1}`,
        district: startDistrict,
        city: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
      },
      receiver: {
        fullName: `Khách hàng ${i + 1}`,
        phone: '0987654321',
        street: `Đường Nguyễn Văn A - ${147 + i}`,
        ward: `Phường ${i + 1}`,
        district: endDistrict,
        city: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
      },
      items: [
        {
          id: `item-${i}-1`,
          name: 'Sản phẩm mẫu',
          quantity: 2,
          weight: 500,
          value: 100000,
        },
      ],
      totalAmount: shippingFee + 15000,
      shippingFee,
      insuranceFee: 5000,
      serviceFee: 10000,
      income: shippingFee,
      driverIncome,
      deliveredAt,
      pickedUpAt: new Date(deliveredAt.getTime() - 2 * 60 * 60 * 1000),
      customerRating: hasRating
        ? {
            id: `rating-${i}`,
            orderId: `order-${i + 1}`,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: ['Phục vụ tốt', 'Giao nhanh', 'Chất lượng tuyệt vời', null][
              Math.floor(Math.random() * 4)
            ],
            createdAt: new Date(),
            ratedBy: `Khách hàng ${i + 1}`,
          }
        : null,
      route: {
        distance: Math.random() * 15 + 2,
        duration: Math.floor(Math.random() * 45) + 15,
        startPoint: {
          fullName: `Bún chả Bá Lan - 25 Lê Duẩn`,
          phone: '0912345678',
          street: '25 Lê Duẩn',
          ward: 'Bến Nghé',
          district: startDistrict,
          city: 'TP. Hồ Chí Minh',
          country: 'Việt Nam',
          coordinates: { latitude: 10.7769, longitude: 106.7009 },
        },
        endPoint: {
          fullName: `Khách hàng ${i + 1}`,
          phone: '0987654321',
          street: `Đường Nguyễn Văn A - ${147 + i}`,
          ward: `Phường ${i + 1}`,
          district: endDistrict,
          city: 'TP. Hồ Chí Minh',
          country: 'Việt Nam',
          coordinates: { latitude: 10.7895, longitude: 106.7088 },
        },
      },
      createdAt: new Date(deliveredAt.getTime() - 3 * 60 * 60 * 1000),
      updatedAt: deliveredAt,
    });
  }

  return orders.sort((a, b) => new Date(b.deliveredAt).getTime() - new Date(a.deliveredAt).getTime());
}
