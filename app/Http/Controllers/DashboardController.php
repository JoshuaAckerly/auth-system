<?php

namespace App\Http\Controllers;

use App\Models\AdminMessage;
use App\Models\Purchase;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->email === config('app.admin_email');
        $userId = $user->id;

        $recentMessages = AdminMessage::forUser($userId)
            ->with(['reads' => fn ($q) => $q->where('user_id', $userId)])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($msg) => [
                'id' => $msg->id,
                'title' => $msg->title,
                'body' => $msg->body,
                'type' => $msg->type,
                'created_at' => $msg->created_at,
                'is_read' => $msg->reads->isNotEmpty(),
            ]);

        $unreadCount = AdminMessage::unreadFor($userId)->count();

        if ($isAdmin) {
            $sales = Purchase::with('user')->latest()->get()->map(fn ($p) => [
                'id' => $p->id,
                'user_name' => $p->user->name ?? '—',
                'item' => $p->item,
                'amount' => $p->amount,
                'paypal_transaction_id' => $p->paypal_transaction_id,
                'created_at' => $p->created_at,
            ]);

            $userInboxCount = UserMessage::where('is_read', false)->count();

            return Inertia::render('Dashboard', [
                'purchases' => [],
                'sales' => $sales,
                'recentMessages' => $recentMessages,
                'unreadCount' => $unreadCount,
                'userInboxCount' => $userInboxCount,
            ]);
        }

        $user->load('purchases');

        $sentMessages = UserMessage::where('user_id', $userId)
            ->latest()
            ->take(3)
            ->get(['id', 'subject', 'is_read', 'created_at']);

        return Inertia::render('Dashboard', [
            'purchases' => $user->purchases->toArray(),
            'sales' => [],
            'recentMessages' => $recentMessages,
            'unreadCount' => $unreadCount,
            'sentMessages' => $sentMessages,
            'userInboxCount' => 0,
        ]);
    }
}
