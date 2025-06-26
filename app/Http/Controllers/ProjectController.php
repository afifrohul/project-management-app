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
                'status' => 'required|in:pending,in_progress,completed'
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

            return Inertia::render('Project/Edit', [
                'project' => $project,
            ]);
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
                'status' => 'required|in:pending,in_progress,completed'
            ]);

            $project = $this->repository->find($id);

            if (!$project || $project->created_by !== auth()->id()) {
                abort(403);
            }

            $this->repository->update($id, $data);

            return redirect()->route('projects.show', $id)->with('success', 'Project updated successfully');
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

    public function team($id)
    {
        try {
            $project = $this->repository->find($id);

            $membersWithRoles = \App\Models\ProjectUserRole::with(['user', 'role'])
                ->where('project_id', $project->id)
                ->where('status', 'accepted')
                ->get();
                
            $membersWithRolesPending = \App\Models\ProjectUserRole::with(['user', 'role'])
                ->where('project_id', $project->id)
                ->where('status', 'pending')
                ->get();

            $assignedUserIds = $membersWithRoles->pluck('user_id')->toArray();

            $availableUsers = \App\Models\User::whereNotIn('id', $assignedUserIds)
                ->select('id', 'name', 'email')
                ->get();

            $roles = \App\Models\Role::get();

            return Inertia::render('Project/Team', [
                'project_id' => $project->id,
                'members' => $membersWithRoles,
                'membersPending' => $membersWithRolesPending,
                'availableUsers' => $availableUsers,
                'roles'=> $roles
            ]);
        } catch (\Exception $e) {
            Log::error("Error loading manage team form for project $id: " . $e->getMessage());
            return redirect()->route('projects.index')->with('error', 'Failed to open manage team form.');
        }
    }

    public function addTeam(Request $request)
    {
        try {
            $data = $request->validate([
                'user_id' => 'required',
                'role_id' => 'required',
                'project_id' => 'required',
            ]);

            $projectUserRole = new \App\Models\ProjectUserRole();
            $projectUserRole->project_id = $data['project_id'];
            $projectUserRole->user_id = $data['user_id'];
            $projectUserRole->role_id = $data['role_id']; 
            $projectUserRole->status = 'pending'; 
            $projectUserRole->save();

            return redirect()->route('projects.team', $data['project_id'] )->with('success', 'Add user successfully');
        } catch (\Exception $e) {
            Log::error('Error add user: ' . $e->getMessage());
            return redirect()->back()->withInput()->with('error', 'Failed to add user.');
        }
    }

    public function deleteTeam($id)
    {
        try {
            $team = \App\Models\ProjectUserRole::findOrFail($id);
            $projectId = $team->project_id;

            $team->delete();

            return redirect()->route('projects.team', $projectId)->with('success', 'Member removed!');
        } catch (\Exception $e) {
            Log::error("Error removing member $id: " . $e->getMessage());
            return redirect()->route('projects.team', $projectId ?? null)->with('error', 'Failed to remove member.');
        }
    }

}
