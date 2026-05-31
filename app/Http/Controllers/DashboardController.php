<?php

namespace App\Http\Controllers;

use App\Models\AdminMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user()->load('purchases');
        $userId = $user->id;

        $recentMessages = AdminMessage::forUser($userId)
            ->with(['reads' => fn ($q) => $q->where('user_id', $userId)])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($msg) => [
                'id' => $msg->id,
                'title' => $msg->title,
                'type' => $msg->type,
                'created_at' => $msg->created_at,
                'is_read' => $msg->reads->isNotEmpty(),
            ]);

        $unreadCount = AdminMessage::unreadFor($userId)->count();

        return Inertia::render('Dashboard', [
            'purchases' => $user->purchases->toArray(),
            'recentMessages' => $recentMessages,
            'unreadCount' => $unreadCount,
        ]);
    }
}
