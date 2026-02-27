// use-orders.ts
import { useEffect, useState } from 'react';
import { http, NestError } from '@/lib/api';
import type { GetOrdersFilters, GetOrdersReturn } from '@/common';

const ORDERS_URL = 'orders';

interface UseOrdersOptions {
  filters?: GetOrdersFilters;
  initialData?: GetOrdersReturn | null;
}

export function useOrders({ filters, initialData }: UseOrdersOptions = {}) {
  const [data, setData] = useState<GetOrdersReturn | null>(initialData || null);
  const [error, setError] = useState<NestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const queryString = buildQueryString(filters);
        const response = await http.get<GetOrdersReturn, NestError>(
          ORDERS_URL + queryString,
        );
        if (!isCancelled) {
          setData(response);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err as NestError);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      isCancelled = true; // cancel setState if component unmounts
    };
  }, [filters]);

  return { data, error, isLoading };
}

// Helper to build query string from filters
function buildQueryString(filters?: GetOrdersFilters) {
  if (!filters) return '';
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}
