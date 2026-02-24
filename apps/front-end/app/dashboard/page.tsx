import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, ShoppingCart } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center font-sans dark:bg-black">
      <div className="flex min-h-screen p-6 w-full max-w-4xl flex-col items-center bg-white dark:bg-black sm:items-start">
        <Card className="w-full border-none shadow-none">
          <CardHeader>
            <CardTitle className="font-bold text-4xl capitalize">
              Dashboard overview
            </CardTitle>
            <CardDescription className="text-lg">
              Welcome to your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-around">
            <Card className="max-w-48 w-full flex flex-col">
              <CardHeader className="px-5 flex items-center justify-between">
                <CardTitle>Total Orders</CardTitle>
                <div className="h-9 w-9 rounded-full flex justify-center items-center bg-blue-50">
                  <ShoppingCart className="block h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="font-bold text-xl text-center">
                0
              </CardContent>
            </Card>
            <Card className="max-w-48 w-full flex flex-col">
              <CardHeader className=" px-5 flex items-center justify-between">
                <CardTitle>Total revenue</CardTitle>
                <div className="h-9 w-9 rounded-full flex justify-center items-center bg-green-50">
                  <DollarSign className="block h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="font-bold text-xl text-center">
                0
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-bold text-xl capitalize">
              Recent orders
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="text-gray-500 py-10">
              No orders yet. Create your first order or import from CSV.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
