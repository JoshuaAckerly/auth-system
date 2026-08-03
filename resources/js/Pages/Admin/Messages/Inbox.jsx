import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Inbox({ messages, unreadCount }) {
    function markRead(id) {
        router.post(route('admin.messages.inbox.read', id));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">User Inbox</h2>
                    <Link
                        href={route('admin.messages.index')}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        ← Outbox
                    </Link>
                </div>
            }
        >
            <Head title="User Inbox" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">

                    {unreadCount > 0 && (
                        <div className="mb-6 flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span>
                                <strong>{unreadCount}</strong> unread message{unreadCount !== 1 ? 's' : ''} from users.
                            </span>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                        {messages.data.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <p className="mt-4 text-sm font-medium text-gray-700">No messages from users yet</p>
                                <p className="mt-1 text-xs text-gray-400">Messages sent by users will appear here.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {messages.data.map((msg) => (
                                    <li
                                        key={msg.id}
                                        className={`flex items-start gap-4 px-6 py-5 ${!msg.is_read ? 'bg-blue-50/40' : ''}`}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-bold select-none mt-0.5">
                                            {(msg.user?.name ?? '?')
                                                .split(' ')
                                                .map((w) => w[0])
                                                .slice(0, 2)
                                                .join('')
                                                .toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <p className={`text-sm ${!msg.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                        {msg.subject}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        From <span className="font-medium text-gray-600">{msg.user?.name ?? '—'}</span>
                                                        {' '}·{' '}
                                                        <span className="text-gray-400">{msg.user?.email}</span>
                                                    </p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {new Date(msg.created_at).toLocaleDateString()}
                                                    </span>
                                                    {!msg.is_read && (
                                                        <button
                                                            onClick={() => markRead(msg.id)}
                                                            className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-200 transition"
                                                        >
                                                            Mark read
                                                        </button>
                                                    )}
                                                    {msg.is_read && (
                                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                                                            Read
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                                            <div className="mt-3">
                                                <Link
                                                    href={route('admin.messages.create') + `?user_id=${msg.user_id}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                    </svg>
                                                    Reply to {msg.user?.name?.split(' ')[0] ?? 'user'}
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {messages.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                                <div className="text-sm text-gray-500">
                                    Page {messages.current_page} of {messages.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {messages.prev_page_url && (
                                        <Link href={messages.prev_page_url} className="rounded border px-3 py-1 text-sm hover:bg-gray-50">
                                            Previous
                                        </Link>
                                    )}
                                    {messages.next_page_url && (
                                        <Link href={messages.next_page_url} className="rounded border px-3 py-1 text-sm hover:bg-gray-50">
                                            Next
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
