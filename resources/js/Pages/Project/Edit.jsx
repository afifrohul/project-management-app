import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/Layouts/AdminLayout';
import { SiteHeader } from '@/Components/site-header';

export default function Edit({ project }) {
  const [form, setForm] = useState({
    name: project.name || '',
    description: project.description || '',
    status: project.status || 'pending',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    router.put(route('projects.update', project.id), form);
  };
  return (
    <AdminLayout siteHeader={<SiteHeader name="Edit Project" />}>
      <Head title="Edit Project" />
      <div className="container max-w-xl flex flex-col gap-4">
        <div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 border p-6 rounded-lg"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <Input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter project description"
                rows={4}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Status</label>
              <Select
                value={form.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.get(route('projects.show', project.id))}
              >
                Cancel
              </Button>
              <Button type="submit">Update Project</Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
