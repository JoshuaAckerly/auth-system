<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminMessage;
use App\Models\AdminMessageRead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $messages = AdminMessage::query()
            ->forUser($user->id)
            ->latest()
            ->paginate(20);

        $readMessageIds = AdminMessageRead::query()
            ->where('user_id', $user->id)
            ->whereIn('admin_message_id', $messages->pluck('id'))
            ->pluck('admin_message_id')
            ->toArray();

        $messages->getCollection()->transform(function ($message) use ($readMessageIds) {
            $message->is_read = in_array($message->id, $readMessageIds);
            return $message;
        });

        $unreadCount = AdminMessage::query()->unreadFor($user->id)->count();

        return response()->json([
            'messages' => $messages,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $message = AdminMessage::query()->forUser($user->id)->findOrFail($id);

        AdminMessageRead::query()->firstOrCreate(
            [
                'admin_message_id' => $message->id,
                'user_id' => $user->id,
            ],
            [
                'read_at' => now(),
            ]
        );

        return response()->json(['success' => true]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $user = $request->user();

        $unreadIds = AdminMessage::query()
            ->unreadFor($user->id)
            ->pluck('id');

        $records = $unreadIds->map(fn ($id) => [
            'admin_message_id' => $id,
            'user_id' => $user->id,
            'read_at' => now(),
        ])->toArray();

        if (! empty($records)) {
            AdminMessageRead::query()->insert($records);
        }

        return response()->json(['success' => true]);
    }
}
