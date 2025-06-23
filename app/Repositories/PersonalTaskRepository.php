<?php

namespace App\Repositories;

use App\Models\PersonalTask;
use App\Repositories\Interfaces\PersonalTaskRepositoryInterface;

class PersonalTaskRepository implements PersonalTaskRepositoryInterface
{
    public function all(): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
      $query = PersonalTask::where('user_id', auth()->id());

      if (request()->has('search')) {
        $search = request('search');
        $query->where(function($q) use ($search) {
          $q->where('title', 'like', "%{$search}%")
            ->orWhere('description', 'like', "%{$search}%");
        });
      }

      if (request()->has('sort_by') && request()->has('sort_dir')) {
        $query->orderBy(request('sort_by'), request('sort_dir'));
      } else {
        $query->latest();
      }

      $perPage = request('per_page', 10);

      return $query->paginate($perPage)->withQueryString();
    }

    public function find(int $id): ?PersonalTask
    {
      return PersonalTask::find($id);
    }

    public function create(array $data): PersonalTask
    {
      $task = new PersonalTask();
      $task->user_id = $data['user_id'];
      $task->title = $data['title'];
      $task->description = $data['description'] ?? null;
      $task->due_date = $data['due_date'] ?? null;
      $task->priority = $data['priority'];
      $task->status = $data['status'] ?? 'pending';
      $task->save();

      return $task;
    }

    public function update(int $id, array $data): bool
    {
      $task = PersonalTask::findOrFail($id);
      $task->title = $data['title'];
      $task->description = $data['description'] ?? null;
      $task->due_date = $data['due_date'] ?? null;
      $task->priority = $data['priority'];
      $task->status = $data['status'];
      return $task->save();
    }

    public function delete(int $id): bool
    {
      $task = PersonalTask::findOrFail($id);
      return $task->delete();
    }
}
