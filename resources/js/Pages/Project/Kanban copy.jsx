import { SiteHeader } from '@/Components/site-header';
import { Separator } from '@/Components/ui/separator';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { faker } from '@faker-js/faker';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kanban';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const columns = [
  { id: faker.string.uuid(), name: 'Pending', color: '#6366F1' },
  { id: faker.string.uuid(), name: 'Pending', color: '#6366F1' }, 
  { id: faker.string.uuid(), name: 'Pending', color: '#6366F1' },
  { id: faker.string.uuid(), name: 'Planned', color: '#6B7280' },
  { id: faker.string.uuid(), name: 'In Progress', color: '#F59E0B' },
  { id: faker.string.uuid(), name: 'Done', color: '#10B981' },
];

// Dummy user generator
const users = Array.from({ length: 4 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  image: faker.image.avatar(),
}));

// Dummy task generator
const exampleFeatures = Array.from({ length: 20 }).map(() => ({
  id: faker.string.uuid(),
  name: capitalize(faker.company.buzzPhrase()),
  startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
  endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
  column: faker.helpers.arrayElement(columns).id,
  owner: faker.helpers.arrayElement(users),
}));

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export default function BoardPage({ project, boards, tasks }) {
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
          >
            {(column) => (
              <KanbanBoard id={column.id} key={column.id}>
                <KanbanHeader>
                  <div className="flex items-center gap-2">
                    <span>{column.name}</span>
                  </div>
                </KanbanHeader>

                <KanbanCards id={column.id}>
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
                              {feature.name}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground italic">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Eius animi est dolor.
                          </p>
                        </div>

                        <p className="m-0 text-muted-foreground text-xs">
                          {shortDateFormatter.format(feature.startAt)} -{' '}
                          {dateFormatter.format(feature.endAt)}
                        </p>

                        {/* <div>
                          {feature.owner && (
                            <Avatar className="h-4 w-4 shrink-0">
                              <AvatarImage src={feature.owner.image} />
                              <AvatarFallback>
                                {feature.owner.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div> */}
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
