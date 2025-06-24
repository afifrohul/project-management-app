import DataTable from '@/Components/DataTable';
import { SiteHeader } from '@/Components/site-header';
import { Button } from '@/Components/ui/button';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { FaPlusCircle } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

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
              key: 'created_at',
              label: 'Created At',
              sortable: true,
              render: (project) =>
                format(parseISO(project.created_at), 'dd MMM yyyy'),
            },
          ]}
          renderActions={(project) => (
            <div className="flex items-center gap-1 justify-end">
              <Button
                variant="ourlinde"
                onClick={() => router.get(route('projects.edit', project.id))}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  if (confirm('Are you sure to delete this project?')) {
                    router.delete(
                      route('projects.destroy', project.id)
                    );
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
