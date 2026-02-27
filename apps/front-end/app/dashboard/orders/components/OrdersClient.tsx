'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateOrderDialog } from './CreateOrderDialog/index.';
import { OrdersDataTable } from './OrdersTable';
import { columns } from './OrdersTable/orders-columns';
import { GetOrdersFilters, GetOrdersReturn } from '@/common';
import { useOrders } from './use-orders';
import OrderFilters from './OrderFilters';

interface OrdersClientProps {
  initialResponse: GetOrdersReturn | null;
}

export default function OrdersClient({ initialResponse }: OrdersClientProps) {
  const [filters, setFilters] = useState<GetOrdersFilters>({});
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useOrders({
    filters: { ...filters, page },
    initialData: initialResponse,
  });

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
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <OrderFilters
              filters={filters}
              meta={data?.meta}
              page={page}
              setPage={setPage}
            />
          </CardContent>
        </Card>

        {data?.data ? (
          <OrdersDataTable columns={columns} data={data?.data || []} />
        ) : (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-600">
            No orders found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
