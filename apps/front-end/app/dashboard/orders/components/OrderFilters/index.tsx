'use-client';

import { GetOrdersFilters, PaginationMeta } from '@/common';
import { Pagination } from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MAX_ITEMS_PER_PAGE = 50;

type Props = {
  filters: GetOrdersFilters;
  setFilters: (filters: GetOrdersFilters) => void;
  meta?: PaginationMeta;
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
};

export default function OrderFilters({
  filters,
  setFilters,
  meta,
  page,
  setPage,
}: Props) {
  function handleCityChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, city: e.target.value });
  }

  function handleCountyChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, county: e.target.value });
  }
  function handleLimitChange(value: string) {
    setFilters({ ...filters, limit: Number(value) });
  }
  console.log(meta);
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap justify-center">
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            value={filters.city ?? ''}
            onChange={handleCityChange}
            placeholder="Enter city"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="county">County</Label>
          <Input
            id="county"
            type="text"
            value={filters.county ?? ''}
            onChange={handleCountyChange}
            placeholder="Enter county"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="limit">Rows per page</Label>
          <Select
            value={(filters.limit ?? MAX_ITEMS_PER_PAGE).toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger id="limit">
              <SelectValue placeholder="Select limit" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100, 1000].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        total={meta?.total ?? 0}
        page={meta?.page ?? page}
        limit={meta?.limit ?? MAX_ITEMS_PER_PAGE}
        setPage={setPage}
      />
    </div>
  );
}
