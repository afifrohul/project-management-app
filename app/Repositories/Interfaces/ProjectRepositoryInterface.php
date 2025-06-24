<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Project;

interface ProjectRepositoryInterface
{
  public function all(): LengthAwarePaginator;
  public function find(int $id): ?Project;
  public function create(array $data): Project;
  public function update(int $id, array $data): bool;
  public function delete(int $id): bool;
}
