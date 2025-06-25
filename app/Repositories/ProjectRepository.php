<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Interfaces\ProjectRepositoryInterface;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function all() : \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
      $query = Project::where('created_by', auth()->id());

      if (request()->has('search')) {
        $search = request('search');
        $query->where(function($q) use ($search) {
          $q->where('name', 'like', "%{$search}%")
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

    public function find(string $id, array $with = []): ?Project
    {
      return Project::with($with)->findOrFail($id);
    }

    public function create(array $data) : Project
    {
      $project = new Project();
      $project->name = $data['name'];
      $project->description = $data['description'] ?? null;
      $project->status = $data['status'] ?? null;
      $project->created_by = $data['user_id'];
      $project->save();

      $projectUserRole = new \App\Models\ProjectUserRole();
      $projectUserRole->project_id = $project->id;
      $projectUserRole->user_id = $data['user_id'];
      $projectUserRole->role_id = 1; 
      $projectUserRole->save();

      return $project;
    }

    public function update(string $id, array $data) : bool
    {
      $project = Project::findOrFail($id);
      $project->name = $data['name'];
      $project->description = $data['description'] ?? null;
      $project->status = $data['status'] ?? null;
      return $project->save();
    }

    public function delete(string $id) : bool
    {
      $project = Project::findOrFail($id);
      return $project->delete();
    }
}
