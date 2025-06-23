<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    public function personalTasks()
    {
        return $this->hasMany(PersonalTask::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_user_roles')
                    ->withPivot('role_id')
                    ->withTimestamps();
    }

    public function projectUserRoles()
    {
        return $this->hasMany(ProjectUserRole::class);
    }

    public function assignedTasks()
    {
        return $this->belongsToMany(Task::class, 'task_assignments')
                    ->withTimestamps();
    }
}
