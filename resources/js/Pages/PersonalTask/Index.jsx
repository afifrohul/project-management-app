import React from 'react';
import { SiteHeader } from '@/Components/site-header';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { FaCheckCircle, FaCircle, FaPlusCircle, FaStopCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import DataTable from '@/Components/DataTable';
import { FiLoader } from 'react-icons/fi';

export default function Index({ tasks }) {
  return (
    <AdminLayout siteHeader={<SiteHeader name="Personal Task" />}>
      <Head title="Personal Task" />

      <div className="container mx-auto flex flex-col gap-4">
        <DataTable
          routeName="personal-tasks.index"
          data={tasks.data}
          meta={tasks}
          defaultSortBy="created_at"
          defaultSortDir="desc"
          createButton={
            <Button
              variant="outline"
              onClick={() => router.get(route('personal-tasks.create'))}
            >
              <FaPlusCircle className="" /> Create New Task
            </Button>
          }
          columns={[
            {
              key: 'title',
              label: 'Title',
              sortable: true,
            },
            {
              key: 'description',
              label: 'Description',
              sortable: true,
              render: (task) =>
                task.description?.length > 50
                  ? task.description.substring(0, 50) + '...'
                  : task.description || '-',
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              render: (task) => (
                <div className="w-fit border py-1 px-2 rounded-lg">
                  {task.status === 'completed' ? (
                    <div className="flex gap-1 items-center text-xs">
                      <FaCheckCircle className="h-4 text-green-600" /> Completed
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
              ),
            },
            {
              key: 'priority',
              label: 'Priority',
              sortable: true,
              render: (task) => {
                const color =
                  task.priority === 'high'
                    ? 'text-red-500'
                    : task.priority === 'medium'
                      ? 'text-yellow-500'
                      : 'text-green-500';
                return (
                  <div className="flex gap-1 items-center text-xs border py-1 px-2 rounded-lg w-fit">
                    <FaCircle className={`h-2 ${color}`}/>
                    {task.priority?.charAt(0).toUpperCase() +
                      task.priority?.slice(1)}
                  </div>
                );
              },
            },
            {
              key: 'due_date',
              label: 'Due Date',
              sortable: true,
              render: (task) =>
                task.due_date
                  ? format(parseISO(task.due_date), 'dd MMMM yyyy')
                  : '-',
            },
          ]}
          renderActions={(task) => (
            <div className='flex gap-1 justify-end'>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  router.get(route('personal-tasks.edit', task.id))
                }
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  if (confirm('Are you sure to delete this task?')) {
                    router.delete(route('personal-tasks.destroy', task.id));
                  }
                }}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </div>
    </AdminLayout>
  );
}
