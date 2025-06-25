<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Project;

interface ProjectRepositoryInterface
{
  public function all(): LengthAwarePaginator;
  public function find(string $id, array $with = []): ?Project;
  public function create(array $data): Project;
  public function update(string $id, array $data): bool;
  public function delete(string $id): bool;
}
