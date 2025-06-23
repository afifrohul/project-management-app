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
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';

export default function Edit({ task }) {
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'pending',
    due_date: task.due_date ? parseISO(task.due_date) : null,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    router.put(route('personal-tasks.update', task.id), {
      ...form,
      due_date: form.due_date ? format(form.due_date, 'yyyy-MM-dd') : null,
    });
  };

  return (
    <AdminLayout siteHeader={<SiteHeader name="Edit Personal Task" />}>
      <Head title="Edit Personal Task" />
      <div className="container max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg">
          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <Input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Priority</label>
            <Select
              value={form.priority}
              onValueChange={(value) => handleChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
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

          <div>
            <label className="block mb-1 text-sm font-medium">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.due_date ? format(form.due_date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.due_date}
                  onSelect={(date) => handleChange('due_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.get(route('personal-tasks.index'))}
            >
              Cancel
            </Button>
            <Button type="submit">Update Task</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
