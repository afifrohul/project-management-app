<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PersonalTaskController;
use App\Http\Controllers\ProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/personal-tasks', [PersonalTaskController::class, 'index'])->name('personal-tasks.index');
    Route::get('/personal-tasks/create', [PersonalTaskController::class, 'create'])->name('personal-tasks.create');
    Route::post('/personal-tasks', [PersonalTaskController::class, 'store'])->name('personal-tasks.store');
    Route::get('/personal-tasks/{id}/edit', [PersonalTaskController::class, 'edit'])->name('personal-tasks.edit');
    Route::put('/personal-tasks/{id}', [PersonalTaskController::class, 'update'])->name('personal-tasks.update');
    Route::delete('/personal-tasks/{id}', [PersonalTaskController::class, 'destroy'])->name('personal-tasks.destroy');

    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');

    Route::middleware('project.role:Owner,Leader')->group(function () {
        Route::get('/projects/{id}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    });

    Route::middleware('project.role:Owner,Leader,Manager')->group(function () {
        Route::get('/projects/team/{id}', [ProjectController::class, 'team'])->name('projects.team');
        Route::post('/projects/team/{id}', [ProjectController::class, 'addTeam'])->name('projects.add-team');
        Route::delete('/projects/team/{id}', [ProjectController::class, 'deleteTeam'])->name('projects.delete-team');
    });

    
    Route::middleware('project.role:Owner,Leader,Manager,Member')->group(function () {
        Route::get('/projects/{id}/show', [ProjectController::class, 'show'])->name('projects.show');   
    });

    Route::get('/invitations', [ProjectController::class, 'invitations'])->name('invitations.index');
    Route::put('/invitations/{id}/accept', [ProjectController::class, 'acceptInvitation'])->name('invitations.accept');
    Route::put('/invitations/{id}/reject', [ProjectController::class, 'rejectInvitation'])->name('invitations.reject');
});

require __DIR__.'/auth.php';
