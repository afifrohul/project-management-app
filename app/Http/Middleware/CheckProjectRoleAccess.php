<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProjectRoleAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$allowedRoles): Response
    {
        $routeId = $request->route('id');

        $project = \App\Models\Project::find($routeId);

        if (!$project) {
            $member = \App\Models\ProjectUserRole::find($routeId);
            if ($member) {
                $project = $member->project ?? null;
            }
        }

        if (!$project) {
            abort(404, 'Project not found');
        }

        $user = auth()->user();

        $role = $project->projectUserRoles()
            ->where('user_id', $user->id)
            ->first()?->role?->name;

        if (!$role) {
            abort(403, 'You are not a member of this project');
        }

        if (!in_array($role, $allowedRoles)) {
            abort(403, 'You do not have permission to access this resource');
        }

        return $next($request);
    }


}
