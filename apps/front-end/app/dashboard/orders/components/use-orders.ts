'use-client';

import { useEffect, useState, useRef } from 'react';
import { http, NestError } from '@/lib/api';
import type { GetOrdersFilters, GetOrdersReturn } from '@/common';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';

const ORDERS_URL = 'orders';

interface UseOrdersOptions {
  filters?: GetOrdersFilters;
  initialData?: GetOrdersReturn | null;
}

export function useOrders({ filters, initialData }: UseOrdersOptions = {}) {
  const [data, setData] = useState<GetOrdersReturn | null>(initialData || null);
  const [error, setError] = useState<NestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();

  // Store previous filters for deep comparison
  const prevFiltersRef = useRef<string>('');
  const initial = useRef<boolean>(true);

  useEffect(() => {
    let isCancelled = false;
    const queryString = buildQueryString(filters);

    if (initial.current && initialData) {
      initial.current = false;
      return () => {
        isCancelled = true;
      };
    }

    if (prevFiltersRef.current === queryString) {
      setIsLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    async function fetchOrders() {
      try {
        setError(null);
        setIsLoading(true);
        const response = await http.get<GetOrdersReturn, NestError>(
          ORDERS_URL + `?${queryString}`,
        );
        if (!isCancelled) {
          setData(response);
        }
      } catch (err) {
        toast.error('Something went wrong while ferching orders');

        if (!isCancelled) setError(err as NestError);
      } finally {
        prevFiltersRef.current = queryString;
        if (!isCancelled) setIsLoading(false);

        // TODO: fix this
        // if (window !== undefined) {
        //   window.history.replaceState(null, '', pathname + '?' + queryString);
        // }
      }
    }

    fetchOrders();

    return () => {
      isCancelled = true;
    };
  }, [filters, initialData]);

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
  return queryString ? queryString : '';
}
