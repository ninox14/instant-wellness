import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateOrderDialog } from './components/CreateOrderDialog';

export default function DashboardOrders() {
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
              <CardContent className="px-0">{/* TODO:  filters */}</CardContent>
            </Card>
            <div className="w-full"> {/* TODO: orders table  */}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
