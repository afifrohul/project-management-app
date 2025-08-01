import { SiteHeader } from '@/Components/site-header';
import { Separator } from '@/Components/ui/separator';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kanban';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AvatarInitials from '@/Components/AvatarInitials';

const getColumns = (boards) => {
  return boards.map((board) => ({
    id: board.id,
    name: board.name,
  }));
};

const getExampleFeatures = (tasks) => {
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

export default function BoardPage({ project, boards, tasks }) {
  console.log(tasks);
  const columns = getColumns(boards);
  const exampleFeatures = getExampleFeatures(tasks);
  const [features, setFeatures] = useState(exampleFeatures);

  return (
    <AdminLayout
      siteHeader={<SiteHeader name={`Kanban Board ${project.name}`} />}
    >
      <Head title={`Kanban Board ${project.name}`} />

      <div className="w-full space-y-4 p-4 sm:p-8 border rounded-lg">
        <h1 className="font-medium">Kanban Board {project.name}</h1>
        <Separator />
        <div className="overflow-x-auto w-full pb-4">
          <KanbanProvider
            columns={columns}
            data={features}
            onDataChange={setFeatures}
            className={'min-h-[42.5rem]'}
          >
            {(column) => (
              <KanbanBoard
                id={column.id}
                key={column.id}
                className="max-h-[42.5rem]"
              >
                <KanbanHeader>
                  <div className="flex items-center gap-2">
                    <span>{column.name}</span>
                  </div>
                </KanbanHeader>

                <KanbanCards id={column.id} className="pr-4 ">
                  {(feature) => (
                    <KanbanCard
                      column={column.id}
                      id={feature.id}
                      key={feature.id}
                      name={feature.name}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <p className="m-0 flex-1 font-medium text-sm">
                              {feature.title}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground italic">
                            {feature.description
                              ? feature.description
                              : 'No description available'}
                          </p>
                        </div>

                        <div>
                          <p className="italic">Due Date: {feature.due_date}</p>
                        </div>

                        <div className='flex justify-between items-center'>
                          <div className="flex items-center gap-1 border rounded w-fit py-1 px-2 mt-1">
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
        </div>
      </div>
    </AdminLayout>
  );
}
