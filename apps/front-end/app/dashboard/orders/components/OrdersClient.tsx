'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateOrderDialog } from './CreateOrderDialog/index.';
import { OrdersDataTable } from './OrdersTable';
import { columns } from './OrdersTable/orders-columns';
import { GetOrdersFilters, GetOrdersReturn } from '@/common';
import { useOrders } from './use-orders';
import OrderFilters from './OrderFilters';
import { SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/use-debounce';
import { Spinner } from '@/components/ui/spinner';

interface OrdersClientProps {
  initialResponse: GetOrdersReturn | null;
}

export default function OrdersClient({ initialResponse }: OrdersClientProps) {
  const [filters, setFilters] = useState<GetOrdersFilters>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const debouncedCitySearch = useDebounce(filters?.city?.trim() || '', 1000);
  const debouncedCountySearch = useDebounce(
    filters?.county?.trim() || '',
    1000,
  );
  const { data, isLoading } = useOrders({
    filters: {
      ...filters,
      city: debouncedCitySearch.length > 2 ? debouncedCitySearch : undefined,
      county:
        debouncedCountySearch.length > 2 ? debouncedCountySearch : undefined,
      page,
    },
    initialData: initialResponse,
  });

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => {
    setSorting((old) => {
      const newSorting = typeof updater === 'function' ? updater(old) : updater;

      const sortingFilters: Record<string, 'asc' | 'desc'> = {};

      for (const s of newSorting) {
        if (s.id === 'id') {
          continue;
        }

        sortingFilters[s.id] = s.desc ? 'desc' : 'asc';
      }

      setFilters((state) => ({ ...state, ...sortingFilters }));

      return newSorting;
    });
  };
  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="font-bold text-4xl capitalize">
          Orders list
        </CardTitle>
        <CreateOrderDialog />
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex">
            <CardTitle className="text-lg grow">Filters</CardTitle>
            {isLoading && <Spinner className="w-6 h-6" />}
          </CardHeader>
          <CardContent className="">
            <OrderFilters
              filters={filters}
              meta={data?.meta}
              page={page}
              setPage={setPage}
              loading={isLoading}
              setFilters={setFilters}
            />
          </CardContent>
        </Card>

        {data?.data ? (
          <OrdersDataTable
            columns={columns}
            data={data?.data || []}
            setSorting={handleSortingChange}
            sorting={sorting}
          />
        ) : (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-600">
            No orders found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
