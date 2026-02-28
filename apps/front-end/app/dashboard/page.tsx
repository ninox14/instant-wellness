import { GetOrdersInfoReturn } from '@/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { http } from '@/lib/api';
import { DollarSign, ShoppingCart } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function fetchOrders() {
  try {
    return http.get<GetOrdersInfoReturn>('orders/info');
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function Dashboard() {
  const info = await fetchOrders();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
      <div className="w-full max-w-6xl p-6 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome to your admin dashboard
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid gap-6 md:grid-cols-2 ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-medium">
                Total Orders
              </CardTitle>
              <div className="h-9 w-9 rounded-full flex justify-center items-center bg-blue-50">
                <ShoppingCart className="block h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-center font-bold">
                {info?.totalOrders || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-medium">
                Total Revenue
              </CardTitle>
              <div className="h-9 w-9 rounded-full flex justify-center items-center bg-green-50">
                <DollarSign className="block h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-center font-bold">
                ${info?.totalRevenue?.toFixed(2) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RECENT ORDERS TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest created orders in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {info && info.recentOrders.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Composite Tax %</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>County</TableHead>
                    <TableHead className="text-right">Created At</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {info.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>${order.subtotal.toFixed(2)}</TableCell>
                      <TableCell>${order.taxAmount.toFixed(2)}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        {(order.compositeTax * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell>{order.geoInfo.city ?? '—'}</TableCell>
                      <TableCell>{order.geoInfo.county ?? '—'}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(order.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                No orders yet. Create your first order or import from CSV.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
