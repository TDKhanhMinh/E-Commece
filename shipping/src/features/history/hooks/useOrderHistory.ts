import { useState, useEffect, useCallback } from 'react';
import type { HistoryOrder, HistoryFilters, DateRangeFilter } from '../types';
import { historyService } from '../services';

interface UseOrderHistoryOptions {
  driverId: string;
  limit?: number;
  initialDateRange?: DateRangeFilter;
}

export function useOrderHistory({
  driverId,
  limit = 50,
  initialDateRange = 'all',
}: UseOrderHistoryOptions) {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [dateRange, setDateRange] = useState<DateRangeFilter>(initialDateRange);

  // Calculate date range based on filter
  const getDateRange = useCallback((range: DateRangeFilter) => {
    const now = new Date();
    let dateFrom: Date | undefined;

    switch (range) {
      case 'today': {
        dateFrom = new Date();
        dateFrom.setHours(0, 0, 0, 0);
        break;
      }
      case 'week': {
        dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - dateFrom.getDay());
        dateFrom.setHours(0, 0, 0, 0);
        break;
      }
      case 'month': {
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      }
      case 'all':
      default: {
        dateFrom = undefined;
        break;
      }
    }

    return dateFrom;
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(
    async (newOffset: number = 0) => {
      try {
        setIsLoading(true);
        setError(null);

        const dateFrom = getDateRange(dateRange);
        const filtersWithDate = {
          ...filters,
          dateFrom,
        };

        const { orders: newOrders, total: newTotal } = await historyService.getOrderHistory(
          driverId,
          filtersWithDate,
          limit,
          newOffset
        );

        setOrders(newOrders);
        setTotal(newTotal);
        setOffset(newOffset);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
      } finally {
        setIsLoading(false);
      }
    },
    [driverId, limit, filters, dateRange, getDateRange]
  );

  // Initial fetch
  useEffect(() => {
    fetchOrders(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  // Search handler
  const handleSearch = useCallback(
    (searchTerm: string) => {
      setFilters(prev => ({
        ...prev,
        search: searchTerm || undefined,
      }));
      setOffset(0);
    },
    []
  );

  // Filter by status
  const handleFilterByStatus = useCallback(
    (status?: 'completed' | 'cancelled') => {
      setFilters(prev => ({
        ...prev,
        status,
      }));
      setOffset(0);
    },
    []
  );

  // Change date range
  const handleChangeDateRange = useCallback((range: DateRangeFilter) => {
    setDateRange(range);
    setOffset(0);
  }, []);

  // Load more
  const loadMore = useCallback(() => {
    if (offset + limit < total) {
      fetchOrders(offset + limit);
    }
  }, [offset, limit, total, fetchOrders]);

  // Refresh
  const refresh = useCallback(() => {
    fetchOrders(0);
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    total,
    offset,
    dateRange,
    filters,
    hasMore: offset + limit < total,
    fetchOrders,
    handleSearch,
    handleFilterByStatus,
    handleChangeDateRange,
    loadMore,
    refresh,
  };
}
