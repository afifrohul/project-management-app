import { SiteHeader } from '@/Components/site-header';
import { Separator } from '@/Components/ui/separator';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kanban';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

export default function BoardPage({ project, boards, tasks }) {
  const columns = boards.map((board) => ({
    id: board.id,
    name: board.name,
    description: board.description,
  }));

  const data = tasks.map((task) => ({
    id: task.id,
    name: task.title,
    description: task.description,
    column: task.board_id,
    priority: task.priority,
    due_date: task.due_date,
  }));

  return (
    <AdminLayout
      siteHeader={<SiteHeader name={`Kanban Board ${project.name}`} />}
    >
      <Head title={`Kanban Board ${project.name}`} />
      <div className="w-full space-y-4 p-4 sm:p-8 border rounded-lg">
        <h1 className="font-medium">Kanban Board {project.name}</h1>
        <Separator></Separator>
        <div className="overflow-x-auto w-full border p-4">
          <KanbanProvider
            columns={columns}
            data={data}
            onDataChange={(updatedData) => {
              console.log(updatedData);
            }}
          >
            {(column) => (
              <KanbanBoard
                id={column.id}
                key={column.id}
                className="min-w-[250px]"
              >
                <KanbanHeader>{column.name}</KanbanHeader>
                <KanbanCards id={column.id}>
                  {(card) => (
                    <KanbanCard key={card.id} id={card.id} name={card.name}>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{card.name}</p>
                        {card.description && (
                          <p className="text-xs text-muted-foreground">
                            {card.description}
                          </p>
                        )}
                        {card.due_date && (
                          <p className="text-[10px] text-muted-foreground italic">
                            Due Date:{' '}
                            {format(
                              new Date(card.due_date),
                              'dd MMM yyyy HH:mm'
                            )}
                          </p>
                        )}
                        {card.priority && (
                          <div className="flex items-center gap-1 text-xs border rounded w-fit py-1 px-2 mt-1">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                card.priority === 'high'
                                  ? 'bg-red-500'
                                  : card.priority === 'medium'
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                              }`}
                            ></span>
                            {card.priority.charAt(0).toUpperCase() +
                              card.priority.slice(1)}
                            <span>Priority </span>
                          </div>
                        )}
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
