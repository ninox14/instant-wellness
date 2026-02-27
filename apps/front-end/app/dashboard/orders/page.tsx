import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateOrderDialog } from './components/CreateOrderDialog';
import { OrdersDataTable } from './components/OrdersTable';
import { columns } from './components/OrdersTable/orders-columns';
import { http } from '@/lib/api';
import { GetOrdersReturn } from '@/common';

async function getOrders(): Promise<GetOrdersReturn | null> {
  try {
    const response = await http.get<GetOrdersReturn>('orders');
    return response;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return null;
  }
}

export default async function DashboardOrders() {
  const orders = await getOrders();

  return (
    <div className="flex min-h-screen w-full items-center justify-center font-sans dark:bg-black">
      <div className="flex min-h-screen p-6 w-full max-w-4xl flex-col items-center bg-white dark:bg-black sm:items-start">
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
              <CardContent className="px-0">{/* TODO: filters */}</CardContent>
            </Card>

            {orders ? (
              <OrdersDataTable columns={columns} data={orders.data} />
            ) : (
              <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-600">
                Failed to load orders. Please try again later.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
