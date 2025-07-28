import DataTable from '@/Components/DataTable';
import { SiteHeader } from '@/Components/site-header';
import { Button } from '@/Components/ui/button';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { FaCheckCircle, FaPlusCircle, FaStopCircle } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { FiLoader } from 'react-icons/fi';

export default function Index({ projects }) {
  return (
    <AdminLayout siteHeader={<SiteHeader name="Projects" />}>
      <Head title="Projects" />
      <div className="w-full mx-auto flex flex col gap-4">
        <DataTable
          routeName="projects.index"
          data={projects.data}
          meta={projects}
          defaultSortBy="created_at"
          defaultSortDir="desc"
          inputSearch
          pagination
          createButton={
            <Button
              variant="outline"
              onClick={() => router.get(route('projects.create'))}
            >
              <FaPlusCircle className="" /> Create New Project
            </Button>
          }
          columns={[
            {
              key: 'name',
              label: 'Project Name',
              sortable: true,
            },
            {
              key: 'description',
              label: 'Description',
              sortable: true,
              render: (project) =>
                project.description?.length > 50
                  ? project.description.substring(0, 50) + '...'
                  : project.description || '-',
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              render: (project) => (
                <div className="w-fit border py-1 px-2 rounded-lg">
                  {project.status === 'completed' ? (
                    <div className="flex gap-1 items-center text-xs">
                      <FaCheckCircle className="h-4 text-green-600" /> Completed
                    </div>
                  ) : project.status === 'in_progress' ? (
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
              key: 'created_at',
              label: 'Created At',
              sortable: true,
              render: (project) =>
                format(parseISO(project.created_at), 'dd MMM yyyy'),
            },
          ]}
          renderActions={(project) => (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="default"
                onClick={() => router.get(route('projects.show', project.id))}
              >
                View
              </Button>
            </div>
          )}
        />
      </div>
    </AdminLayout>
  );
}
