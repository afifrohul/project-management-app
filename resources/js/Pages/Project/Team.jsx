import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/Layouts/AdminLayout';
import { SiteHeader } from '@/Components/site-header';
import DataTable from '@/Components/DataTable';
import AvatarInitials from '@/Components/AvatarInitials';
import DeleteButton from '@/Components/DeleteButton';

export default function Team({
  project_id,
  members,
  availableUsers,
  roles,
  membersPending,
}) {
  const [form, setForm] = useState({
    project_id: project_id,
    user_id: '',
    role_id: '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    router.post(route('projects.add-team'), form, {
      onSuccess: () => {
        setForm((prev) => ({
          ...prev,
          user_id: '',
          role_id: '',
        }));
      },
    });
  };

  return (
    <AdminLayout siteHeader={<SiteHeader name="Manage Team Project" />}>
      <Head title="Manage Team Project" />
      <div className="container w-full flex flex-col gap-4">
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold">Pending Team Structure</h1>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-4 items-center">
                <Select
                  value={form.user_id}
                  onValueChange={(value) => handleChange('user_id', value)}
                >
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex gap-2 items-center">
                          {/* <AvatarInitials className="inline" name={user.name} /> */}
                          <p className="text-sm">
                            <strong>{user.name}</strong>
                            {/* ({user.email}) */}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.role_id}
                  onValueChange={(value) => handleChange('role_id', value)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        <div className="flex gap-2 items-center">
                          <p className="text-sm">{role.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" variant="default">
                  Add User
                </Button>
              </div>
            </form>
          </div>
          <DataTable
            data={membersPending}
            columns={[
              {
                key: 'name',
                label: 'Name',
                sortable: false,
                render: (row) => row.user?.name,
              },
              {
                key: 'role',
                label: 'Role',
                sortable: false,
                render: (row) => row.role?.name,
              },
              {
                key: 'status',
                label: 'Status',
                sortable: false,
              },
            ]}
            renderActions={(membersPending) => (
              <div className="flex items-center gap-1 justify-end">
                <DeleteButton
                  label="Remove"
                  confirmMessage="Are you sure to cancel this invitation user?"
                  routeName="projects.delete-team"
                  id={membersPending.id}
                />
              </div>
            )}
          />
        </div>
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold">Active Team Structure</h1>
          </div>
          <DataTable
            data={members}
            columns={[
              {
                key: 'name',
                label: 'Name',
                sortable: false,
                render: (row) => row.user?.name,
              },
              {
                key: 'role',
                label: 'Role',
                sortable: false,
                render: (row) => row.role?.name,
              },
              {
                key: 'status',
                label: 'Status',
                sortable: false,
              },
            ]}
            renderActions={(members) => (
              <div className="flex items-center gap-1 justify-end">
                <DeleteButton
                  routeName="projects.delete-team"
                  id={members.id}
                />
              </div>
            )}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
