import React from 'react';
import { SiteHeader } from '@/Components/site-header';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
  FaCheckCircle,
  FaCircle,
  FaPlusCircle,
  FaStopCircle,
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import DataTable from '@/Components/DataTable';
import { FiLoader } from 'react-icons/fi';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/Components/ui/separator';
import EditButton from '@/Components/EditButton';
import ConfirmButton from '@/Components/ConfirmButton';

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
          inputSearch
          pagination
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
                task.description?.length > 30
                  ? task.description.substring(0, 30) + '...'
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
                    <FaCircle className={`h-2 ${color}`} />
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
            <div className="flex gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Detail
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-2/3">
                  <DialogHeader>
                    <DialogTitle>Detail Task</DialogTitle>
                    <DialogDescription>
                      Here is the detail of the task.
                    </DialogDescription>
                    <Separator />
                    <div className="flex flex-col gap-3 text-muted-foreground">
                      <div>
                        <div className="font-semibold">Title</div>
                        <div className="text-sm">{task.title}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Description</div>
                        <div className="text-sm">{task.description}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Status</div>
                        <div className="">
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
                              <FaStopCircle className="h-4 text-yellow-500" />{' '}
                              Not Started
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">Priority</div>
                        <div className="flex gap-1 items-center text-xs">
                          {task.priority === 'high' ? (
                            <FaCircle className="h-2 text-red-500" />
                          ) : task.priority === 'medium' ? (
                            <FaCircle className="h-2 text-yellow-500" />
                          ) : (
                            <FaCircle className="h-2 text-green-500" />
                          )}
                          {task.priority?.charAt(0).toUpperCase() +
                            task.priority?.slice(1)}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">Due Date</div>
                        <div className="text-sm">
                          {task.due_date
                            ? format(parseISO(task.due_date), 'dd MMMM yyyy')
                            : '-'}
                        </div>
                      </div>
                    </div>
                  </DialogHeader>
                  <Separator />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <EditButton routeName="personal-tasks.edit" id={task.id} />
              <ConfirmButton routeName="personal-tasks.destroy" id={task.id} />
            </div>
          )}
        />
      </div>
    </AdminLayout>
  );
}
