<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\PersonalTask;

interface PersonalTaskRepositoryInterface
{
  public function all(): LengthAwarePaginator;
  public function find(string $id): ?PersonalTask;
  public function create(array $data): PersonalTask;
  public function update(string $id, array $data): bool;
  public function delete(string $id): bool;
}