import DataTable from '@/Components/DataTable';
import { SiteHeader } from '@/Components/site-header';
import { Button } from '@/Components/ui/button';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { FaCheckCircle, FaCircle, FaStopCircle } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { FiLoader } from 'react-icons/fi';
import { Separator } from '@/Components/ui/separator';
import ConfirmButton from '@/Components/ConfirmButton';

export default function Invitations({ invitations }) {
  return (
    <AdminLayout siteHeader={<SiteHeader name="Project Invitations" />}>
      <Head title="Project Invitations" />
      <div className="w-full mx-auto flex flex-col gap-4">
        <DataTable
          routeName="invitations.index"
          data={invitations.data}
          meta={invitations}
          defaultSortBy="created_at"
          defaultSortDir="desc"
          inputSearch
          pagination
          columns={[
            {
              key: 'name',
              label: 'Project Name',
              sortable: true,
              render: (row) => row.project?.name || '-',
            },
            {
              key: 'status',
              label: 'Project Status',
              sortable: true,
              render: (row) => (
                <div className="w-fit border py-1 px-2 rounded-lg">
                  {row.project.status === 'completed' ? (
                    <div className="flex gap-1 items-center text-xs">
                      <FaCheckCircle className="h-4 text-green-600" /> Completed
                    </div>
                  ) : row.project.status === 'in_progress' ? (
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
              key: 'role',
              label: 'Role',
              sortable: true,
              render: (row) => row.role?.name || '-',
            },
            {
              key: 'approval_status',
              label: 'Approval Status',
              sortable: true,
              render: (row) => (
                <div className="w-fit border py-1 px-2 rounded-lg">
                  {row.status === 'accepted' ? (
                    <div className="flex gap-1 items-center text-xs">
                      <FaCircle className="h-2 text-green-600" /> Accepted
                    </div>
                  ) : row.status === 'pending' ? (
                    <div className="flex gap-1 items-center text-xs">
                      <FaCircle className="h-2 text-yellow-500" /> Pending
                    </div>
                  ) : (
                    <div className="flex gap-1 items-center text-xs">
                      <FaCircle className="h-2 text-red-500" /> Decline
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'created_at',
              label: 'Invitation Date',
              sortable: true,
              render: (row) => format(parseISO(row.created_at), 'dd MMM yyyy - HH:mm'),
            },
          ]}
          renderActions={(invitations) =>
            (invitations.status === 'pending' && (
              <div className="flex items-center gap-1 ">
                <ConfirmButton
                  routeName="invitations.reject"
                  id={invitations.id}
                  label="Decline"
                  confirmMessage="Are you sure you want to decline this invitation?"
                  variant="outline"
                  method="put"
                />
                <ConfirmButton
                  routeName="invitations.accept"
                  id={invitations.id}
                  label="Accept"
                  confirmMessage="Are you sure you want to accept this invitation?"
                  variant="default"
                  method="put"
                />
              </div>
            )) || <div className="text-xs">No actions available</div>
          }
        />
      </div>
    </AdminLayout>
  );
}
