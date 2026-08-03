<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMessage extends Model
{
    protected $fillable = [
        'user_id',
        'subject',
        'body',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
