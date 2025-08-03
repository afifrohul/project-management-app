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
import { FaCircle, FaPlusCircle } from 'react-icons/fa';
import ConfirmButton from '@/Components/ConfirmButton';
import {
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import { Textarea } from '@/Components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/ui/popover';
import { Calendar } from '@/Components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';

import AssignmentSelect from '@/Components/AssignmentSelect';

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
    assignment: task.assignments.map((a) => ({
      id: a.id,
      name: a.name,
    })),
    column: task.board_id,
  }));
};

export default function BoardPage({
  project,
  boards,
  tasks,
  yourRole,
  members,
}) {
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
    priority: 'low',
    due_date: null,
    assignments: [],
    board_id: null,
  });

  const [openDetailModal, setOpenDetailModal] = useState(false);

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
                          placeholder="Enter board name"
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
                      <div
                        className={`flex flex-col gap-1 border-r-2 pr-1 ${
                          feature.priority === 'high'
                            ? 'border-red-500'
                            : feature.priority === 'medium'
                              ? 'border-yellow-500'
                              : 'border-green-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 flex-col">
                          <div className="flex justify-between items-center w-full gap-4">
                            <p className="m-0 flex-1 font-medium text-base">
                              {feature.title}
                            </p>
                            {/* {yourRole?.role.name === 'Owner' ||
                            yourRole?.role.name === 'Leader' ||
                            yourRole?.role.name === 'Manager' ? ( */}
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
                                    priority: feature.priority,
                                    due_date: feature.due_date,
                                    assignments: feature.assignment.map(
                                      (a) => ({
                                        id: a.id,
                                        name: a.name,
                                      })
                                    ),
                                    board_id: column.id,
                                  });
                                  setOpenDetailModal(true);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <EyeIcon />
                              </Button>
                              <Button
                                variant="ghost"
                                size="tiny_icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTask(feature);
                                  setForm({
                                    title: feature.title,
                                    description: feature.description,
                                    priority: feature.priority,
                                    due_date: feature.due_date,
                                    assignments: feature.assignment.map(
                                      (a) => a.id
                                    ),
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
                            {/* ) : null} */}
                          </div>
                          <div>
                            <p className="italic text-xs">
                              Due Date: {feature.due_date}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {feature.assignment.map((a) => (
                              <AvatarInitials name={a.name} key={a.id} />
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
          <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
            <DialogContent className="sm:max-w-[425px] w-2/3">
              <DialogHeader>
                <DialogTitle>Detail Task</DialogTitle>
                <DialogDescription>
                  Here is the detail of the task.
                </DialogDescription>
                <Separator />
                <div className="flex flex-col gap-3 ">
                  <div>
                    <div className="font-semibold">Title</div>
                    <div className="text-sm">{form.title}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Description</div>
                    <div className="text-sm">{form.description}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Priority</div>
                    <div className="flex gap-1 items-center text-xs">
                      {form.priority === 'high' ? (
                        <FaCircle className="h-2 text-red-500" />
                      ) : form.priority === 'medium' ? (
                        <FaCircle className="h-2 text-yellow-500" />
                      ) : (
                        <FaCircle className="h-2 text-green-500" />
                      )}
                      {form.priority?.charAt(0).toUpperCase() +
                        form.priority?.slice(1)}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Due Date</div>
                    <div className="text-sm">
                      {form.due_date
                        ? format(form.due_date, 'dd MMMM yyyy')
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Board</div>
                    <div className="text-sm">
                      {form.board_id
                        ? (boards.find((b) => b.id === form.board_id)?.name ??
                          '-')
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Assignments</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {form.assignments?.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-2 border w-fit rounded-lg pr-2"
                        >
                          <AvatarInitials name={a.name} />
                          <p className="font-medium text-xs">{a.name}</p>
                        </div>
                      ))}
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
          <Dialog open={openTaskModal} onOpenChange={setOpenTaskModal}>
            <DialogContent className="sm:max-w-[425px]">
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

                  router[method](
                    url,
                    {
                      ...form,
                      due_date: form.due_date
                        ? format(form.due_date, 'yyyy-MM-dd')
                        : null,
                    },
                    {
                      preserveScroll: true,
                      onSuccess: () => {
                        setOpenTaskModal(false);
                        setEditingTask(null);
                      },
                    }
                  );
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
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Enter task description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={form.priority}
                      onValueChange={(value) =>
                        setForm({ ...form, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>{' '}
                            <p>Low</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>{' '}
                            <p>Medium</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>{' '}
                            <p>High</p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.due_date ? (
                            format(form.due_date, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.due_date}
                          onSelect={(date) =>
                            setForm({ ...form, due_date: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="assignment">Assignment</Label>
                    <AssignmentSelect
                      users={members}
                      selected={form.assignments}
                      onChange={(value) =>
                        setForm({ ...form, assignments: value })
                      }
                    />
                  </div>
                  {editingTask ? (
                    <div>
                      <Label htmlFor="board">Board</Label>
                      <Select
                        value={form.board_id}
                        onValueChange={(value) =>
                          setForm({ ...form, board_id: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select board" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map((column) => (
                            <SelectItem key={column.id} value={column.id}>
                              {column.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
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
