'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DragDropFileInput from './components/CsvDropzone';
import { http } from '@/lib/api';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type SampleOrder = {
  id: number;
  longitude: number;
  latitude: number;
  timestamp: string;
  subtotal: number;
};

const SAMPLE_ORDERS: SampleOrder[] = [
  {
    id: 1,
    longitude: -78.8671866447861,
    latitude: 42.01246326237433,
    timestamp: '2025-11-04 10:17:04.915257248',
    subtotal: 120.0,
  },
  {
    id: 2,
    longitude: -76.2653141983343,
    latitude: 42.47899580935274,
    timestamp: '2025-11-04 22:20:08.135761513',
    subtotal: 120.0,
  },
  {
    id: 3,
    longitude: -73.8825612264399,
    latitude: 40.834113404202824,
    timestamp: '2025-11-05 09:02:14.699513608',
    subtotal: 25.0,
  },
  {
    id: 4,
    longitude: -73.43870366161902,
    latitude: 44.71699277095472,
    timestamp: '2025-11-05 22:32:56.886229408',
    subtotal: 120.0,
  },
];

export default function DashboardImport() {
  const [loading, setLoading] = useState(false);
  async function handleSubmit(file: File, clearFile: () => void) {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await http.postForm('orders/import', formData);

      clearFile();
      // TODO: redirect or show prettier toast ?
      console.log(response);
      toast.success('Uploaded successfully');
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    }
    setLoading(false);
  }
  function handleSampleDownload() {
    const csvContent = `id,longitude,latitude,timestamp,subtotal
1,-78.8671866447861,42.01246326237433,2025-11-04 10:17:04.915257248,120.0
2,-76.2653141983343,42.47899580935274,2025-11-04 22:20:08.135761513,120.0
3,-73.8825612264399,40.834113404202824,2025-11-05 09:02:14.699513608,25.0
4,-73.43870366161902,44.71699277095472,2025-11-05 22:32:56.886229408,120.0`;

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample-orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center font-sans dark:bg-black">
      <div className="flex min-h-screen p-6 w-full max-w-4xl flex-col items-center bg-white dark:bg-black sm:items-start">
        <Card className="w-full border-none shadow-none">
          <CardHeader>
            <CardTitle className="font-bold text-4xl capitalize">
              Import Orders from CSV
            </CardTitle>
            <CardDescription className="text-lg">
              Upload a CSV file to bulk import orders
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV file</CardTitle>
                <CardDescription>
                  Drag and drop a CSV file or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <DragDropFileInput loading={loading} onSubmit={handleSubmit} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>CSV Format</CardTitle>
                <CardDescription>
                  Your CSV file should include the following columns
                </CardDescription>
              </CardHeader>
              <CardContent className="mx-5 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>id</TableHead>
                      <TableHead>longitude</TableHead>
                      <TableHead>latitude</TableHead>
                      <TableHead>timestamp</TableHead>
                      <TableHead>subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SAMPLE_ORDERS.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.longitude}</TableCell>
                        <TableCell>{order.latitude}</TableCell>
                        <TableCell>{order.timestamp}</TableCell>
                        <TableCell>{order.subtotal.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Ensure your CSV headers match exactly as shown above.
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSampleDownload}
                >
                  Download Sample CSV
                </Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
