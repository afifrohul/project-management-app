import AvatarInitials from '@/Components/AvatarInitials';
import ConfirmButton from '@/Components/ConfirmButton';
import DataTable from '@/Components/DataTable';
import EditButton from '@/Components/EditButton';
import { SiteHeader } from '@/Components/site-header';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { FaCheckCircle, FaPlusCircle, FaStopCircle } from 'react-icons/fa';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

export default function Show({ project, members, yourRole, roleNames }) {
  const groupedMembers = members.reduce((groups, member) => {
    const roleName = member.role.name;
    if (!groups[roleName]) {
      groups[roleName] = [];
    }
    groups[roleName].push(member);
    return groups;
  }, {});

  const [creatingBoardName, setCreatingBoardName] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [boardName, setBoardName] = useState('');

  return (
    <AdminLayout siteHeader={<SiteHeader name={project.name} />}>
      <Head title={project.name} />
      <div className="w-full mx-auto flex flex-col gap-4">
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <h1 className="text-xl font-bold">{project.name}</h1>
              <Badge className={'h-5'}>{yourRole?.role.name}</Badge>
            </div>
            <div className="flex gap-2">
              {(yourRole?.role.name === 'Owner' ||
                yourRole?.role.name === 'Leader' ||
                yourRole?.role.name === 'Manager') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.get(route('projects.team', project.id))}
                >
                  Manage Team
                </Button>
              )}

              {(yourRole?.role.name === 'Owner' ||
                yourRole?.role.name === 'Leader') && (
                <>
                  <EditButton routeName="projects.edit" id={project.id} />
                </>
              )}

              {yourRole?.role.name === 'Owner' && (
                <>
                  <ConfirmButton routeName="projects.destroy" id={project.id} />
                </>
              )}

              {yourRole?.role.name !== 'Owner' && (
                <ConfirmButton
                  routeName="projects.leave"
                  label="Leave Project"
                  confirmMessage="Are you sure you want to leave this project?"
                  id={yourRole?.id}
                />
              )}
            </div>
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
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between">
            <div className="flex gap-2 justify-between items-center w-full">
              <h1 className="font-bold">Project Board</h1>
              <a href={route('projects.kanban', project.id)} target="_blank">
                <Button
                  variant="outline"
                >
                  Open Kanban Board <LuSquareArrowOutUpRight />
                </Button>
              </a>
            </div>
          </div>
          <Separator className="my-4" />
          <DataTable
            data={project.boards}
            createButton={
              yourRole?.role.name === 'Owner' ||
              yourRole?.role.name === 'Leader' ||
              yourRole?.role.name === 'Manager' ? (
                <div className="flex justify-end w-full">
                  <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FaPlusCircle className="mr-1" /> Create New Board
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          router.post(
                            route('projects.store-board', project.id),
                            { name: creatingBoardName },
                            {
                              preserveScroll: true,
                              onSuccess: () => {
                                setCreatingBoardName('');
                                setOpenCreate(false);
                              },
                            }
                          );
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>Create New Board</DialogTitle>
                          <DialogDescription>
                            Fill in the details for the new board.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 mt-3">
                          <div className="grid gap-3">
                            <Label htmlFor="create-name">Board Name</Label>
                            <Input
                              id="create-name"
                              name="name"
                              value={creatingBoardName}
                              onChange={(e) =>
                                setCreatingBoardName(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter className={'mt-3'}>
                          <DialogClose asChild>
                            <Button variant="outline" type="button">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit">Save</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={!!editingBoard}
                    onOpenChange={(open) => {
                      if (!open) setEditingBoard(null);
                    }}
                  >
                    <DialogContent className="sm:max-w-[425px]">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          router.put(
                            route('projects.update-board', {
                              id: project.id,
                              board: editingBoard.id,
                            }),
                            {
                              name: boardName,
                            },
                            {
                              preserveScroll: true,
                              onSuccess: () => setEditingBoard(null),
                            }
                          );
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>Edit Board</DialogTitle>
                          <DialogDescription>
                            Update the board details.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 mt-3">
                          <Label htmlFor="edit-name">Board Name</Label>
                          <Input
                            id="edit-name"
                            name="name"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                          />
                        </div>

                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button variant="outline" type="button">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : null
            }
            columns={[
              {
                key: 'name',
                label: 'Name',
                sortable: false,
                render: (row) => row.name,
              },
            ]}
            renderActions={(board) => (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingBoard(board);
                    setBoardName(board.name);
                  }}
                >
                  Edit
                </Button>
                <ConfirmButton
                  label="Delete"
                  confirmMessage="Are you sure to delete this board?"
                  routeName="projects.delete-board"
                  id={{ id: project.id, board: board.id }}
                />
              </div>
            )}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
