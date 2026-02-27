'use-client';

import { GetOrdersFilters, PaginationMeta } from '@/common';
import { Pagination } from '@/components/Pagination';
const MAX_ITEMS_PER_PAGE = 50;
type Props = {
  filters: GetOrdersFilters;
  meta?: PaginationMeta;
  page: number;
  setPage: (page: number) => void;
};
export default function OrderFilters({ meta, page, setPage }: Props) {
  return (
    <div>
      <Pagination
        total={meta?.total ?? 0}
        page={meta?.page ?? page}
        limit={meta?.limit ?? MAX_ITEMS_PER_PAGE}
        setPage={setPage}
      />
    </div>
  );
}
