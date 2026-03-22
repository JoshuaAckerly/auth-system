<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminMessageRead extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'admin_message_id',
        'user_id',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    public function message()
    {
        return $this->belongsTo(AdminMessage::class, 'admin_message_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
