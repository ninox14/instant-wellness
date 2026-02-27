'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Column } from '@tanstack/react-table';
import { Order } from '@/common';

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}
export function SortableHeader<TData, TValue>({
  column,
  title,
}: SortableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <SortableHeader column={column} title="ID" />,
  },
  {
    id: 'county',
    accessorFn: (row) => row.geoInfo.county,
    header: 'County',
  },
  {
    id: 'city',
    accessorFn: (row) => row.geoInfo.city,
    header: 'City',
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => <SortableHeader column={column} title="Date" />,
    cell: ({ row }) => new Date(row.getValue('timestamp')).toLocaleString(),
  },
  {
    accessorKey: 'subtotal',
    header: ({ column }) => <SortableHeader column={column} title="Subtotal" />,
  },
  {
    accessorKey: 'taxAmount',
    header: ({ column }) => (
      <SortableHeader column={column} title="Tax Amount" />
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => <SortableHeader column={column} title="Total" />,
  },
  {
    accessorKey: 'compositeTax',
    header: ({ column }) => (
      <SortableHeader column={column} title="Composite Tax" />
    ),
  },
  {
    id: 'stateRate',
    accessorFn: (row) => row.breakdown.stateRate,
    header: ({ column }) => (
      <SortableHeader column={column} title="State Rate" />
    ),
  },
  {
    id: 'countyRate',
    accessorFn: (row) => row.breakdown.countyRate,
    header: ({ column }) => (
      <SortableHeader column={column} title="County Rate" />
    ),
  },
  {
    id: 'cityRate',
    accessorFn: (row) => row.breakdown.cityRate,
    header: ({ column }) => (
      <SortableHeader column={column} title="City Rate" />
    ),
  },
  {
    id: 'specialRates',
    accessorFn: (row) => row.breakdown.specialRates,
    header: ({ column }) => (
      <SortableHeader column={column} title="Special Rate" />
    ),
  },
];
