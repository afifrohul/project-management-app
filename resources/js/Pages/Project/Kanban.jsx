import { SiteHeader } from '@/Components/site-header';
import { Separator } from '@/Components/ui/separator';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kanban';
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
import AvatarInitials from '@/Components/AvatarInitials';
import { Button } from '@/Components/ui/button';
import { FaPlusCircle } from 'react-icons/fa';
import ConfirmButton from '@/Components/ConfirmButton';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useEffect } from 'react';

const getColumns = (boards) => {
  return boards.map((board) => ({
    id: board.id,
    name: board.name,
  }));
};

const getFeatures = (tasks) => {
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    due_date: format(new Date(task.due_date), 'MMM dd, yyyy'),
    priority: task.priority,
    assigmnent: task.assignments.map((assignment) => ({
      id: assignment.id,
      name: assignment.name,
    })),
    column: task.board_id,
  }));
};

export default function BoardPage({ project, boards, tasks, yourRole }) {
  const columns = getColumns(boards);
  const features = getFeatures(tasks);

  const [creatingBoardName, setCreatingBoardName] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [boardName, setBoardName] = useState('');

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    board_id: '',
  });

  return (
    <AdminLayout
      siteHeader={<SiteHeader name={`Kanban Board ${project.name}`} />}
    >
      <Head title={`Kanban Board ${project.name}`} />

      <div className="w-full space-y-4 p-6 border rounded-lg">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <h1 className="font-medium">Kanban Board {project.name}</h1>
          </div>
          {yourRole?.role.name === 'Owner' ||
          yourRole?.role.name === 'Leader' ||
          yourRole?.role.name === 'Manager' ? (
            <div className="flex justify-end w-full">
              <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FaPlusCircle className="mr-1" /> Add New Board
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
                      <DialogTitle>Add New Board</DialogTitle>
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
                          onChange={(e) => setCreatingBoardName(e.target.value)}
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
          ) : null}
        </div>
        <Separator />
        <div className="overflow-x-auto w-full pb-4">
          <KanbanProvider
            columns={columns}
            data={features}
            onDataChange={() => {}}
            isModalOpen={openTaskModal || openCreate}
            className={'min-h-[42.5rem]'}
          >
            {(column) => (
              <KanbanBoard
                id={column.id}
                key={column.id}
                className="max-h-[42.5rem]"
              >
                <KanbanHeader>
                  <div className="flex items-center justify-between pr-2">
                    <p>{column.name}</p>
                    {yourRole?.role.name === 'Owner' ||
                    yourRole?.role.name === 'Leader' ||
                    yourRole?.role.name === 'Manager' ? (
                      <div className="flex items-center gap-1">
                        <Button
                          size="mini_icon"
                          variant="outline"
                          onClick={() => {
                            setForm({
                              title: '',
                              description: '',
                              board_id: column.id,
                            });
                            setEditingTask(null);
                            setOpenTaskModal(true);
                          }}
                        >
                          <PlusIcon />
                        </Button>
                        <Button
                          size="mini_icon"
                          variant="outline"
                          onClick={() => {
                            setEditingBoard(column);
                            setBoardName(column.name);
                          }}
                        >
                          <PencilIcon />
                        </Button>
                        <ConfirmButton
                          size="mini_icon"
                          variant="outline"
                          label={<TrashIcon />}
                          confirmMessage="Are you sure to delete this board?"
                          routeName="projects.delete-board"
                          id={{ id: project.id, board: column.id }}
                        />
                      </div>
                    ) : null}
                  </div>
                </KanbanHeader>

                <KanbanCards id={column.id} className="pr-4 ">
                  {(feature) => (
                    <KanbanCard
                      column={column.id}
                      id={feature.id}
                      key={feature.id}
                      name={feature.name}
                      className="group"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2 flex-col">
                          <div className="flex justify-between items-center w-full gap-4">
                            <p className="m-0 flex-1 font-medium text-sm">
                              {feature.title}
                            </p>
                            {yourRole?.role.name === 'Owner' ||
                            yourRole?.role.name === 'Leader' ||
                            yourRole?.role.name === 'Manager' ? (
                              <div className="hidden group-hover:flex items-center justify-between">
                                <Button
                                  variant="ghost"
                                  size="tiny_icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTask(feature);
                                    setForm({
                                      title: feature.title,
                                      description: feature.description,
                                      board_id: column.id,
                                    });
                                    setOpenTaskModal(true);
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <PencilIcon />
                                </Button>
                                <ConfirmButton
                                  size="tiny_icon"
                                  variant="ghost"
                                  label={<TrashIcon />}
                                  confirmMessage="Are you sure to delete this task?"
                                  routeName="projects.delete-task"
                                  id={{ id: project.id, task: feature.id }}
                                  method="delete"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                />
                              </div>
                            ) : null}
                          </div>
                          {/* <div>
                            <p className="text-muted-foreground italic text-xs ">
                              {feature.description
                                ? feature.description
                                : 'No description available'}
                            </p>
                          </div> */}
                          {/* <div>
                            <p className="italic text-xs">
                              Due Date: {feature.due_date}
                            </p>
                          </div> */}
                          {/* <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 border rounded w-fit py-1 px-2 mt-1 text-xs">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  feature.priority === 'high'
                                    ? 'bg-red-500'
                                    : feature.priority === 'medium'
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                }`}
                              ></span>
                              {feature.priority.charAt(0).toUpperCase() +
                                feature.priority.slice(1)}
                              <span>Priority </span>
                            </div>
                          </div> */}
                          <div>
                            {feature.assigmnent.map((assignment) => (
                              <AvatarInitials
                                name={assignment.name}
                                key={assignment.id}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </KanbanCard>
                  )}
                </KanbanCards>
              </KanbanBoard>
            )}
          </KanbanProvider>
          <Dialog open={openTaskModal} onOpenChange={setOpenTaskModal}>
            <DialogContent className="sm:max-w-[424px]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const method = editingTask ? 'put' : 'post';
                  const url = editingTask
                    ? route('projects.update-task', {
                        id: project.id,
                        task: editingTask.id,
                      })
                    : route('projects.store-task', project.id);

                  router[method](url, form, {
                    preserveScroll: true,
                    onSuccess: () => {
                      setOpenTaskModal(false);
                      setEditingTask(null);
                    },
                  });
                }}
              >
                <DialogHeader>
                  <DialogTitle>
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTask
                      ? 'Update the task details.'
                      : 'Fill in the details for the new task.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
}
