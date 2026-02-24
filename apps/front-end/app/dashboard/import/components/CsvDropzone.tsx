'use client';

import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileUp, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Props = { onSubmit: (file: File) => void };

export default function DragDropFileInput({ onSubmit }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        setFile(null);
        setError('Only one CSV file is allowed.');
        return;
      }

      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
    },
  });

  return (
    <Card className="w-full mx-auto border-none shadow-none">
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            'w-full py-7 px-3 text-center cursor-pointer rounded-md  border-dashed border-2 border-gray-300',
            isDragActive && 'border-blue-500 bg-blue-50',
          )}
        >
          <input {...getInputProps()} />
          <div className="flex items-center flex-col">
            <FileUp
              className={cn(
                'block w-12 h-12 text-gray-400 mb-3',
                isDragActive && 'text-blue-500',
              )}
            />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <div className="text-gray-700">
                <span className="text-blue-500">Click to upload </span>
                or drag and drop
              </div>
            )}
            <p className="text-gray-500 text-sm mt-2">CSV files only</p>
          </div>
        </div>
        <div className="w-full">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {file && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Files:</h4>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-4" key={file.name}>
                  <div>{file.name}</div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setFile(null)}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Button
            className="mt-4 block mx-auto"
            disabled={!file}
            onClick={() => {
              if (file) onSubmit(file);
            }}
          >
            Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
