<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\PersonalTaskRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PersonalTaskController extends Controller
{
  protected $repository;

  public function __construct(PersonalTaskRepositoryInterface $repository)
  {
    $this->repository = $repository;
  }

  public function index()
  {
    try {
      $tasks = $this->repository->all();
      return Inertia::render('PersonalTask/Index', compact('tasks'));
    } catch (\Exception $e) {
      Log::error('Error loading personal tasks: ' . $e->getMessage());
      return redirect()->back()->with('error', 'Failed to load tasks.');
    }
  }

  public function create()
  {
    try {
      return Inertia::render('PersonalTask/Create');
    } catch (\Exception $e) {
      Log::error('Error showing create form: ' . $e->getMessage());
      return redirect()->route('personal-tasks.index')->with('error', 'Failed to open create form.');
    }
  }

  public function store(Request $request)
  {
    try {
      $data = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'due_date' => 'nullable|date',
        'priority' => 'required|in:low,medium,high',
      ]);

      $data['user_id'] = auth()->id();
      $data['status'] = 'pending';

      $this->repository->create($data);

      return redirect()->route('personal-tasks.index')->with('success', 'Task created!');
    } catch (\Exception $e) {
      Log::error('Error creating task: ' . $e->getMessage());
      return redirect()->back()->withInput()->with('error', 'Failed to create task.');
    }
  }

  public function edit($id)
  {
      try {
        $task = $this->repository->find($id);

        if (!$task || $task->user_id !== auth()->id()) {
          abort(403);
        }

        return Inertia::render('PersonalTask/Edit', compact('task'));
      } catch (\Exception $e) {
        Log::error("Error loading edit form for task $id: " . $e->getMessage());
        return redirect()->route('personal-tasks.index')->with('error', 'Failed to open edit form.');
      }
  }

  public function update(Request $request, $id)
  {
    try {
      $data = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'due_date' => 'nullable|date',
        'priority' => 'required|in:low,medium,high',
        'status' => 'required|in:pending,in_progress,completed'
      ]);

      $task = $this->repository->find($id);

      if (!$task || $task->user_id !== auth()->id()) {
        abort(403);
      }

      $this->repository->update($id, $data);

      return redirect()->route('personal-tasks.index')->with('success', 'Task updated!');
    } catch (\Exception $e) {
      Log::error("Error updating task $id: " . $e->getMessage());
      return redirect()->back()->withInput()->with('error', 'Failed to update task.');
    }
  }

  public function destroy($id)
  {
    try {
      $task = $this->repository->find($id);

      if (!$task || $task->user_id !== auth()->id()) {
        abort(403);
      }

      $this->repository->delete($id);

      return redirect()->route('personal-tasks.index')->with('success', 'Task deleted!');
    } catch (\Exception $e) {
      Log::error("Error deleting task $id: " . $e->getMessage());
      return redirect()->route('personal-tasks.index')->with('error', 'Failed to delete task.');
    }
  }
}
