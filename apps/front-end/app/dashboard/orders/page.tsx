import OrdersClient from './components/OrdersClient';
import { http } from '@/lib/api';
import { GetOrdersReturn } from '@/common';

export const dynamic = 'force-dynamic';

async function getOrders(): Promise<GetOrdersReturn | null> {
  try {
    const response = await http.get<GetOrdersReturn>('orders');
    return response;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return null;
  }
}

export default async function DashboardOrdersPage() {
  const response = await getOrders();

  return (
    <div className="flex min-h-screen w-full items-center justify-center font-sans dark:bg-black">
      <div className="flex min-h-screen p-6 w-full max-w-7xl flex-col items-center bg-white dark:bg-black sm:items-start">
        <OrdersClient initialResponse={response} />
      </div>
    </div>
  );
}
