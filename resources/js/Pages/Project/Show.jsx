import AvatarInitials from '@/Components/AvatarInitials';
import { SiteHeader } from '@/Components/site-header';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { FaCheckCircle, FaStopCircle } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';

export default function Show({ project, members, yourRole, roleNames }) {
  const groupedMembers = members.reduce((groups, member) => {
    const roleName = member.role.name;
    if (!groups[roleName]) {
      groups[roleName] = [];
    }
    groups[roleName].push(member);
    return groups;
  }, {});

  return (
    <AdminLayout siteHeader={<SiteHeader name={project.name} />}>
      <Head title={project.name} />
      <div className="w-full mx-auto flex flex-col gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex gap-2">
            <h1 className="text-xl font-bold">{project.name}</h1>
            <Badge className={'h-5'}>{yourRole?.role.name}</Badge>
          </div>
          <Separator className="my-4" />
          <div className="flex gap-16">
            <div className="w-1/3">
              <div className="text-gray-700 mb-2">
                <strong>Description:</strong>{' '}
                <div className="text-sm">
                  {project.description || 'No description provided.'}
                </div>
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Status:</strong>
                <div className="w-fit">
                  {project.status === 'completed' ? (
                    <div className="flex gap-1 items-center text-sm">
                      <FaCheckCircle className="h-4 text-green-600" /> Completed
                    </div>
                  ) : project.status === 'in_progress' ? (
                    <div className="flex gap-1 items-center text-sm">
                      <FiLoader className="h-4" /> In Progress
                    </div>
                  ) : (
                    <div className="flex gap-1 items-center text-sm">
                      <FaStopCircle className="h-4 text-yellow-500" /> Not
                      Started
                    </div>
                  )}
                </div>
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Created At:</strong>{' '}
                <div className="text-sm">
                  {format(new Date(project.created_at), 'dd MMMM yyyy')}
                </div>
              </div>
            </div>
            <div className="w-2/3">
              <div className="text-gray-700">
                <strong>Team Structure:</strong>
                <div className="text-sm flex flex-wrap gap-2 mt-1">
                  {members.length > 0 ? (
                    roleNames.map(
                      (role) =>
                        groupedMembers[role] && (
                          <div key={role} className="mb-4">
                            <h3 className="font-bold mb-2">{role}</h3>
                            <div className="flex flex-wrap gap-2">
                              {groupedMembers[role].map((member) => (
                                <div
                                  key={member.id}
                                  className="items-center flex border w-fit pr-2 rounded-lg gap-2"
                                >
                                  <AvatarInitials name={member.user.name} />
                                  <p className="font-semibold text-xs">
                                    {member.user.name}
                                  </p>
                                  <p className="text-xs">{member.role.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                    )
                  ) : (
                    <span>No members assigned to this project.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
