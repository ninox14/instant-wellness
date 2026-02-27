'use-client';

import { useEffect, useState, useRef } from 'react';
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

  // Store previous filters for deep comparison
  const prevFiltersRef = useRef<string>('');
  const initial = useRef<boolean>(true);

  useEffect(() => {
    let isCancelled = false;
    async function fetchOrders() {
      if (initial.current && initialData) {
        initial.current = false;
        return () => {
          isCancelled = true;
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const queryString = buildQueryString(filters);

        if (prevFiltersRef.current === queryString) return; // no change
        const response = await http.get<GetOrdersReturn, NestError>(
          ORDERS_URL + queryString,
        );
        if (!isCancelled) {
          prevFiltersRef.current = queryString;
          setData(response);
        }
      } catch (err) {
        if (!isCancelled) setError(err as NestError);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    fetchOrders();

    return () => {
      isCancelled = true;
    };
  }, [filters, initialData]); // will still trigger effect when filters reference changes, but deep compare prevents unnecessary fetch

  return { data, error, isLoading };
}

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
