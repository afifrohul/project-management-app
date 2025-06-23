<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\PersonalTask;

interface PersonalTaskRepositoryInterface
{
  public function all(): LengthAwarePaginator;
  public function find(int $id): ?PersonalTask;
  public function create(array $data): PersonalTask;
  public function update(int $id, array $data): bool;
  public function delete(int $id): bool;
}