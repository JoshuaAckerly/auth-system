<?php

namespace App\Http\Controllers;

use App\Models\AdminMessage;
use App\Models\AdminMessageRead;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserMessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $messages = AdminMessage::forUser($userId)
            ->with(['reads' => fn ($q) => $q->where('user_id', $userId)])
            ->latest()
            ->get()
            ->map(fn ($msg) => [
                'id' => $msg->id,
                'title' => $msg->title,
                'body' => $msg->body,
                'type' => $msg->type,
                'created_at' => $msg->created_at,
                'is_read' => $msg->reads->isNotEmpty(),
            ]);

        $sent = UserMessage::where('user_id', $userId)
            ->latest()
            ->get(['id', 'subject', 'body', 'is_read', 'created_at']);

        return Inertia::render('Messages/Index', [
            'messages' => $messages,
            'sent' => $sent,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        UserMessage::create([
            'user_id' => $request->user()->id,
            'subject' => $validated['subject'],
            'body' => $validated['body'],
        ]);

        return back()->with('success', 'Message sent successfully.');
    }

    public function markRead(Request $request, int $id)
    {
        $user = $request->user();
        $message = AdminMessage::forUser($user->id)->findOrFail($id);

        AdminMessageRead::firstOrCreate([
            'admin_message_id' => $message->id,
            'user_id' => $user->id,
        ]);

        return back();
    }
}
