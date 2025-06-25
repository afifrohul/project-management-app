<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\ProjectRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProjectController extends Controller
{
    protected $repository;

    public function __construct(ProjectRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $projects = $this->repository->all();
            return Inertia::render('Project/Index', compact('projects'));
        } catch (\Exception $e) {
            Log::error('Error loading projects: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load projects.');
        }
    }

    public function create()
    {
        try {
            return Inertia::render('Project/Create');
        } catch (\Exception $e) {
            Log::error('Error showing create form: ' . $e->getMessage());
            return redirect()->route('projects.index')->with('error', 'Failed to open create form.');
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $data['user_id'] = auth()->id();

            $this->repository->create($data);

            return redirect()->route('projects.index')->with('success', 'Project created successfully');
        } catch (\Exception $e) {
            Log::error('Error creating project: ' . $e->getMessage());
            return redirect()->back()->withInput()->with('error', 'Failed to create project.');
        }
    }

    public function show($id)
    {
        try {
            $project = $this->repository->find($id);

            $membersWithRoles = \App\Models\ProjectUserRole::with(['user', 'role'])
                ->where('project_id', $project->id)
                ->get();

            $yourRole = \App\Models\ProjectUserRole::with('role')->where('user_id', auth()->id())->where('project_id', $id)->first();

            if (!$project || $project->created_by !== auth()->id()) {
                abort(403);
            }

            return Inertia::render('Project/Show', [
                'roleNames' => \App\Models\Role::pluck('name')->toArray(),
                'project' => $project,
                'members' => $membersWithRoles,
                'yourRole' => $yourRole,
            ]);
        } catch (\Exception $e) {
            Log::error("Error loading project $id: " . $e->getMessage());
            return redirect()->route('projects.index')->with('error', 'Failed to load project details.');
        }
    }  

    public function edit($id)
    {
        try {
            $project = $this->repository->find($id);

            if (!$project || $project->created_by !== auth()->id()) {
            abort(403);
            }

            return Inertia::render('Project/Edit', compact('project'));
        } catch (\Exception $e) {
            Log::error("Error loading edit form for project $id: " . $e->getMessage());
            return redirect()->route('projects.index')->with('error', 'Failed to open edit form.');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $project = $this->repository->find($id);

            if (!$project || $project->created_by !== auth()->id()) {
                abort(403);
            }

            $this->repository->update($id, $data);

            return redirect()->route('projects.index')->with('success', 'Project updated successfully');
        } catch (\Exception $e) {
            Log::error("Error updating project $id: " . $e->getMessage());
            return redirect()->back()->withInput()->with('error', 'Failed to update project.');
        }
        
    }

    public function destroy($id)
    {
        try {
            $project = $this->repository->find($id);

            if (!$project || $project->created_by !== auth()->id()) {
                abort(403);
            }
            
            $this->repository->delete($id);

            return redirect()->route('projects.index')->with('success', 'Project deleted!');
        } catch (\Exception $e) {
            Log::error("Error deleting project $id: " . $e->getMessage());
            return redirect()->route('projects.index')->with('error', 'Failed to delete project.');
        }
    }
}
