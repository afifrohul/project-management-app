import React, { useEffect, useState } from 'react';
import { SiteHeader } from '@/Components/site-header';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import useDebounce from '@/hooks/useDebounce';
import {
  FaCheckCircle,
  FaCircle,
  FaPencilAlt,
  FaPlusCircle,
  FaStopCircle,
  FaTrash,
} from 'react-icons/fa';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/Components/ui/input';
import { format, parseISO } from 'date-fns';

export default function Index({ tasks }) {
  const truncate = (text, length = 50) => {
    if (!text) return '-';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const initialSearch =
    new URLSearchParams(location.search).get('search') || '';
  const initialPerPage =
    new URLSearchParams(location.search).get('per_page') || '10';

  const [search, setSearch] = useState(initialSearch);
  const [perPage, setPerPage] = useState(initialPerPage);

  const debouncedSearch = useDebounce(search, 500);

  const initialSortBy =
    new URLSearchParams(location.search).get('sort_by') || 'created_at';
  const initialSortDir =
    new URLSearchParams(location.search).get('sort_dir') || 'desc';

  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDir, setSortDir] = useState(initialSortDir);

  const buildQuery = (extra = {}) => ({
    search: debouncedSearch,
    per_page: perPage,
    sort_by: sortBy,
    sort_dir: sortDir,
    ...extra,
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      // toggle direction
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  useEffect(() => {
    router.get(route('personal-tasks.index'), buildQuery({ page: 1 }), {
      preserveState: true,
      replace: true,
    });
  }, [debouncedSearch, perPage, sortBy, sortDir]);

  const goToPage = (page) => {
    router.get(route('personal-tasks.index'), buildQuery({ page }), {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <AdminLayout siteHeader={<SiteHeader name="Personal Task" />}>
      <Head title="Personal Task" />

      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex justify-between">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <Button
            variant="outline"
            onClick={() => router.get(route('personal-tasks.create'))}
          >
            <FaPlusCircle className="mr-1" /> Create New Task
          </Button>
        </div>

        <div className="border rounded-lg py-2 px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead
                  onClick={() => handleSort('title')}
                  className="cursor-pointer"
                >
                  Title {sortBy === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  onClick={() => handleSort('description')}
                  className="cursor-pointer"
                >
                  Description{' '}
                  {sortBy === 'description' && (sortDir === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  onClick={() => handleSort('status')}
                  className="cursor-pointer"
                >
                  Status{' '}
                  {sortBy === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  onClick={() => handleSort('priority')}
                  className="cursor-pointer"
                >
                  Priority{' '}
                  {sortBy === 'priority' && (sortDir === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  onClick={() => handleSort('due_date')}
                  className="cursor-pointer"
                >
                  Due Date{' '}
                  {sortBy === 'due_date' && (sortDir === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.data.map((task, index) => (
                <TableRow key={task.id}>
                  <TableCell>{tasks.from - 1 + index + 1}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{truncate(task.description)}</TableCell>
                  <TableCell>
                    <div className="w-fit border py-1 px-2 rounded-lg">
                      {task.status === 'completed' ? (
                        <div className="flex gap-1 items-center text-xs">
                          <FaCheckCircle className="h-4 text-green-600" />{' '}
                          Completed
                        </div>
                      ) : task.status === 'in_progress' ? (
                        <div className="flex gap-1 items-center text-xs">
                          <FiLoader className="h-4" /> In Progress
                        </div>
                      ) : (
                        <div className="flex gap-1 items-center text-xs">
                          <FaStopCircle className="h-4 text-yellow-500" /> Not
                          Started
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center text-xs border py-1 px-2 rounded-lg">
                      <FaCircle
                        className={`h-2 ${
                          task.priority === 'high'
                            ? 'text-red-500'
                            : task.priority === 'medium'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                        }`}
                      />
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.due_date
                      ? format(parseISO(task.due_date), 'dd MMMM yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.get(route('personal-tasks.edit', task.id))
                      }
                    >
                      {/* <FaPencilAlt /> */}
                      Edit
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure to delete this task?')) {
                          router.delete(
                            route('personal-tasks.destroy', task.id)
                          );
                        }
                      }}
                    >
                      {/* <FaTrash /> */}
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tasks.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan="7" className="text-center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm">
            Showing {tasks.from || 0} to {tasks.to || 0} of {tasks.total} tasks
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
              <Button
                size="sm"
                variant="outline"
                disabled={tasks.current_page === 1}
                onClick={() => goToPage(1)}
              >
                <MdKeyboardDoubleArrowLeft />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={tasks.current_page === 1}
                onClick={() => goToPage(tasks.current_page - 1)}
              >
                <MdKeyboardArrowLeft />
              </Button>
              <span className="text-sm">
                {tasks.current_page} / {tasks.last_page}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={tasks.current_page === tasks.last_page}
                onClick={() => goToPage(tasks.current_page + 1)}
              >
                <MdKeyboardArrowRight />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={tasks.current_page === tasks.last_page}
                onClick={() => goToPage(tasks.last_page)}
              >
                <MdKeyboardDoubleArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
