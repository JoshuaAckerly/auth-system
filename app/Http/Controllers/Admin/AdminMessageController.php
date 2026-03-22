<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMessageController extends Controller
{
    public function index()
    {
        $messages = AdminMessage::query()
            ->latest()
            ->paginate(20);

        $userCount = User::count();

        $messages->getCollection()->transform(function ($message) use ($userCount) {
            $message->read_count = $message->reads()->count();
            $message->recipient_count = $message->type === 'broadcast' ? $userCount : 1;
            $message->recipient_name = $message->user?->name;
            return $message;
        });

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
        ]);
    }

    public function create()
    {
        $users = User::query()
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Messages/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
            'type' => ['required', 'in:individual,broadcast'],
            'user_id' => ['required_if:type,individual', 'nullable', 'exists:users,id'],
        ]);

        AdminMessage::create([
            'title' => $validated['title'],
            'body' => $validated['body'],
            'type' => $validated['type'],
            'user_id' => $validated['type'] === 'broadcast' ? null : $validated['user_id'],
        ]);

        return redirect()->route('admin.messages.index');
    }

    public function show(AdminMessage $message)
    {
        $message->load(['user', 'reads.user']);

        $userCount = User::count();
        $message->read_count = $message->reads->count();
        $message->recipient_count = $message->type === 'broadcast' ? $userCount : 1;

        return Inertia::render('Admin/Messages/Show', [
            'message' => $message,
        ]);
    }
}
