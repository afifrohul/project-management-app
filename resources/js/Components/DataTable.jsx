import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import useDebounce from '@/hooks/useDebounce';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function DataTable({
  columns = [],
  data = [],
  meta = {},
  routeName,
  defaultSortBy = 'created_at',
  defaultSortDir = 'desc',
  renderActions,
  createButton = null,
}) {
  const [search, setSearch] = useState(
    new URLSearchParams(location.search).get('search') || ''
  );
  const [perPage, setPerPage] = useState(
    new URLSearchParams(location.search).get('per_page') || '10'
  );
  const [sortBy, setSortBy] = useState(
    new URLSearchParams(location.search).get('sort_by') || defaultSortBy
  );
  const [sortDir, setSortDir] = useState(
    new URLSearchParams(location.search).get('sort_dir') || defaultSortDir
  );

  const debouncedSearch = useDebounce(search, 500);

  const buildQuery = (extra = {}) => ({
    search: debouncedSearch,
    per_page: perPage,
    sort_by: sortBy,
    sort_dir: sortDir,
    ...extra,
  });

  useEffect(() => {
    router.get(route(routeName), buildQuery({ page: 1 }), {
      preserveState: true,
      replace: true,
    });
  }, [debouncedSearch, perPage, sortBy, sortDir]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const goToPage = (page) => {
    router.get(route(routeName), buildQuery({ page }), {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        {createButton}
      </div>

      <div className="border rounded-lg py-2 px-4">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={col.sortable ? 'cursor-pointer' : ''}
                >
                  {col.label}
                  {col.sortable && sortBy === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </TableHead>
              ))}
              {renderActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
                {renderActions && (
                  <TableCell className="text-right">
                    {renderActions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm">
          Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm">Rows per page</p>
            <Select value={perPage} onValueChange={setPerPage}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <Button size="sm" variant="outline" disabled={meta.current_page === 1} onClick={() => goToPage(1)}>
              <MdKeyboardDoubleArrowLeft />
            </Button>
            <Button size="sm" variant="outline" disabled={meta.current_page === 1} onClick={() => goToPage(meta.current_page - 1)}>
              <MdKeyboardArrowLeft />
            </Button>
            <span className="text-sm">
              {meta.current_page} / {meta.last_page}
            </span>
            <Button size="sm" variant="outline" disabled={meta.current_page === meta.last_page} onClick={() => goToPage(meta.current_page + 1)}>
              <MdKeyboardArrowRight />
            </Button>
            <Button size="sm" variant="outline" disabled={meta.current_page === meta.last_page} onClick={() => goToPage(meta.last_page)}>
              <MdKeyboardDoubleArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

