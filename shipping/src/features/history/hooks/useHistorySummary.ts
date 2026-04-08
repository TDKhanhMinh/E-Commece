import { useState, useEffect, useCallback } from 'react';
import type { HistorySummary, DateRangeFilter } from '../types';
import { historyService } from '../services';

interface UseHistorySummaryOptions {
  driverId: string;
  dateRange?: DateRangeFilter;
}

export function useHistorySummary({
  driverId,
  dateRange = 'all',
}: UseHistorySummaryOptions) {
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Calculate date range
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

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dateFrom = getDateRange(dateRange);
      const newSummary = await historyService.getHistorySummary(driverId, dateFrom);

      setSummary(newSummary);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch summary'));
    } finally {
      setIsLoading(false);
    }
  }, [driverId, dateRange, getDateRange]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    isLoading,
    error,
    refresh: fetchSummary,
  };
}
