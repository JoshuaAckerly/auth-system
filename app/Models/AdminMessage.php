<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class AdminMessage extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'body',
        'type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reads()
    {
        return $this->hasMany(AdminMessageRead::class);
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where(function (Builder $q) use ($userId) {
            $q->where('type', 'broadcast')
                ->orWhere('user_id', $userId);
        });
    }

    public function scopeUnreadFor(Builder $query, int $userId): Builder
    {
        return $query->forUser($userId)
            ->whereDoesntHave('reads', function (Builder $q) use ($userId) {
                $q->where('user_id', $userId);
            });
    }
}
