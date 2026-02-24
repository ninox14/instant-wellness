'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DragDropFileInput from './components/CsvDropzone';

export default function DashboardImport() {
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
                <DragDropFileInput onSubmit={(file) => console.log(file)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>CSV Format</CardTitle>
                <CardDescription>
                  Your CSV file should include the following columns
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                {/* TODO: CSV format example or sample csv download */}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
