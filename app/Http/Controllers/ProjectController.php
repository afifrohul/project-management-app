<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\ProjectRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\ProjectUserRole;
use App\Models\Board;
use App\Models\Project;
use App\Models\Task;

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
            $project = $this->repository->find($id, ['boards']);

            $membersWithRoles = \App\Models\ProjectUserRole::with(['user', 'role'])
                ->where('project_id', $project->id)
                ->where('status', '!=', 'pending')
                ->get();

            $yourRole = \App\Models\ProjectUserRole::with('role')->where('user_id', auth()->id())->where('project_id', $id)->first();

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

    public function leaveProject($id)
    {
        try {
            $team = \App\Models\ProjectUserRole::findOrFail($id);
            $team->delete();

            return redirect()->route('projects.index')->with('success', 'Successfully left the project!');
        } catch (\Exception $e) {
            Log::error("Error removing member $id: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to leave the project.');
        }
    }


    public function invitations(Request $request)
    {
        try {
            $search = $request->input('search');
            $perPage = $request->input('per_page', 10);
            $sortBy = $request->input('sort_by', 'created_at');
            $sortDir = $request->input('sort_dir', 'desc');

            $query = ProjectUserRole::query()
                ->select('project_user_roles.*')
                ->join('projects', 'projects.id', '=', 'project_user_roles.project_id')
                ->join('roles', 'roles.id', '=', 'project_user_roles.role_id')
                ->join('users', 'users.id', '=', 'project_user_roles.user_id')
                ->with(['project', 'role', 'user'])
                ->where('project_user_roles.user_id', auth()->id());

            // Pencarian (search)
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('projects.name', 'like', "%{$search}%")
                    ->orWhere('roles.name', 'like', "%{$search}%");
                });
            }

            $sortableFields = [
                'project.name' => 'projects.name',
                'role.name' => 'roles.name',
                'user.name' => 'users.name',
                'created_at' => 'project_user_roles.created_at',
            ];

            $sortColumn = $sortableFields[$sortBy] ?? 'project_user_roles.created_at';

            $invitations = $query
                ->orderBy($sortColumn, $sortDir)
                ->paginate($perPage)
                ->withQueryString();

            return Inertia::render('Project/Invitations', [
                'invitations' => $invitations,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading invitations: ' . $e->getMessage());
            return redirect()->route('projects.index')->with('error', 'Failed to load invitations.');
        }
    }


    public function acceptInvitation($id)
    {
        try {
            $team = \App\Models\ProjectUserRole::findOrFail($id);
            $team->status = 'accepted';
            $team->save();

            return redirect()->route('invitations.index', $team->project_id)->with('success', 'Member accepted!');
        } catch (\Exception $e) {
            Log::error("Error accepting member $id: " . $e->getMessage());
            return redirect()->route('invitations.index', $team->project_id ?? null)->with('error', 'Failed to accept member.');
        }
    }

    public function rejectInvitation($id)
    {
        try {
            $team = \App\Models\ProjectUserRole::findOrFail($id);
            $team->status = 'decline';
            $team->save();

            return redirect()->route('invitations.index', $team->project_id)->with('success', 'Member rejected!');
        } catch (\Exception $e) {
            Log::error("Error rejecting member $id: " . $e->getMessage());
            return redirect()->route('invitations.index', $team->project_id ?? null)->with('error', 'Failed to reject member.');
        }
    }

    public function storeBoard(Request $request, $projectId)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            $project = $this->repository->find($projectId);
            if (!$project) {
                return redirect()->back()->with('error', 'Project not found.');
            }

            $board = new \App\Models\Board();
            $board->name = $data['name'];
            $board->project_id = $projectId;
            $board->save();

            return redirect()->back()->with('success', 'Board created successfully');
        } catch (\Exception $e) {
            Log::error("Error creating board for project $projectId: " . $e->getMessage());
            return redirect()->back()->withInput()->with('error', 'Failed to create board.');
        }
    }

    public function updateBoard(Request $request, $projectId, $boardId)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            $board = \App\Models\Board::where('project_id', $projectId)
                ->findOrFail($boardId);

            $board->name = $data['name'];
            $board->save();

            return redirect()->back()->with('success', 'Board updated successfully.');
        } catch (\Exception $e) {
            \Log::error("Error updating board $boardId in project $projectId: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update board.');
        }
    }


    public function destroyBoard($id, $boardId)
    {
        try {
            $board = Board::where('project_id', $id)->findOrFail($boardId);
            $board->delete();

            return redirect()->back()->with('success', 'Board deleted successfully.');
        } catch (\Exception $e) {
            \Log::error("Error deleting board $boardId from project $id: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete board.');
        }
    }

    public function getKanbanData($id)
    {
        $project = Project::with('boards.tasks')->findOrFail($id);

        $yourRole = \App\Models\ProjectUserRole::with('role')->where('user_id', auth()->id())->where('project_id', $id)->first();

        $boards = Board::where('project_id', $id)->orderBy('created_at')->get();

        $tasks = Task::where('project_id', $id)
            ->with(['assignments'])
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Project/Kanban', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
            ],
            'boards' => $boards,
            'tasks' => $tasks,
            'yourRole' => $yourRole,
        ]);
    }


    public function storeTask(Request $request, $projectId)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'board_id' => 'required|exists:boards,id',
        ]);

        try {
            $project = $this->repository->find($projectId);
            if (!$project) {
                return redirect()->back()->with('error', 'Project not found.');
            }

            $task = new \App\Models\Task();
            $task->title = $data['title'];
            $task->description = $data['description'];
            $task->priority = $data['priority'];
            $task->due_date = $data['due_date'];
            $task->board_id = $data['board_id'];
            $task->project_id = $projectId;
            $task->save();

            return redirect()->back()->with('success', 'Task created successfully');
        } catch (\Exception $e) {
            Log::error("Error creating task for project $projectId: " . $e->getMessage());
            return redirect()->back()->withInput()->with('error', 'Failed to create task.');
        }
    }

    public function updateTask(Request $request, $projectId, $taskId)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'board_id' => 'required|exists:boards,id',
        ]);

        try {
            $task = \App\Models\Task::where('project_id', $projectId)
                ->findOrFail($taskId);

            $task->title = $data['title'];
            $task->description = $data['description'];
            $task->priority = $data['priority'];
            $task->due_date = $data['due_date'];
            $task->board_id = $data['board_id'];
            $task->save();

            return redirect()->back()->with('success', 'Task updated successfully.');
        } catch (\Exception $e) {
            \Log::error("Error updating task $taskId in project $projectId: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update task.');
        }
    }


    public function destroyTask($id, $taskId)
    {
        try {
            $task = Task::where('project_id', $id)->findOrFail($taskId);
            $task->delete();

            return redirect()->back()->with('success', 'Task deleted successfully.');
        } catch (\Exception $e) {
            \Log::error("Error deleting task $taskId from project $id: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete task.');
        }
    }




}
