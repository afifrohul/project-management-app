<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id', 'board_id', 'title', 'description', 
        'due_date', 'priority', 'status'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'task_assignments')
                    ->withTimestamps();
    }
}
