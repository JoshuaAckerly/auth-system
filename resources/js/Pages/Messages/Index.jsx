import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function Index({ messages = [], sent = [] }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('inbox');

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        body: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('messages.store'), {
            onSuccess: () => {
                reset();
                setActiveTab('sent');
            },
        });
    }

    const unread = messages.filter((m) => !m.is_read);

    return (
        <AuthenticatedLayout>
            <Head title="Messages" />

            <div className="py-10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Messages</h1>
                            <p className="mt-1 text-sm text-white/70">
                                Your inbox and conversations with Graveyard Jokes Studios.
                            </p>
                        </div>
                        <button
                            onClick={() => setActiveTab('compose')}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Message
                        </button>
                    </div>

                    {/* Flash success */}
                    {flash?.success && (
                        <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.success}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="mb-6 flex gap-1 rounded-xl bg-black/10 p-1">
                        {[
                            { key: 'inbox', label: 'Inbox', count: unread.length },
                            { key: 'sent', label: 'Sent', count: null },
                            { key: 'compose', label: 'Compose', count: null },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    activeTab === tab.key
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                {tab.label}
                                {tab.count != null && tab.count > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Inbox */}
                    {activeTab === 'inbox' && (
                        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center py-16 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-gray-700">Your inbox is empty</p>
                                    <p className="mt-1 text-xs text-gray-400">Announcements and personal messages from the team will appear here.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-50">
                                    {messages.map((msg) => (
                                        <li
                                            key={msg.id}
                                            className={`flex items-start gap-4 px-6 py-4 ${!msg.is_read ? 'bg-blue-50/40' : ''}`}
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white text-sm font-bold select-none mt-0.5">
                                                GJ
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm ${!msg.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                        {msg.title}
                                                    </p>
                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${msg.type === 'broadcast' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {msg.type === 'broadcast' ? 'Announcement' : 'Personal'}
                                                        </span>
                                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            {new Date(msg.created_at).toLocaleDateString()}
                                                        </span>
                                                        {!msg.is_read && (
                                                            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                                        )}
                                                    </div>
                                                </div>
                                                {msg.body && (
                                                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{msg.body}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Sent */}
                    {activeTab === 'sent' && (
                        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                            {sent.length === 0 ? (
                                <div className="flex flex-col items-center py-16 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-gray-700">No messages sent yet</p>
                                    <p className="mt-1 text-xs text-gray-400">Messages you send to us will appear here.</p>
                                    <button
                                        onClick={() => setActiveTab('compose')}
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                                    >
                                        Send your first message
                                    </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-50">
                                    {sent.map((msg) => (
                                        <li key={msg.id} className="flex items-start gap-4 px-6 py-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-bold select-none mt-0.5">
                                                {getInitials(user.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{msg.subject}</p>
                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${msg.is_read ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                                            {msg.is_read ? 'Read' : 'Pending'}
                                                        </span>
                                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            {new Date(msg.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2">{msg.body}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Compose */}
                    {activeTab === 'compose' && (
                        <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
                            <h2 className="mb-1 text-base font-semibold text-gray-900">Send a Message</h2>
                            <p className="mb-6 text-sm text-gray-500">
                                Have a question or need help? We&apos;ll get back to you as soon as possible.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Subject
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="What's this about?"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                    {errors.subject && (
                                        <p className="mt-1.5 text-xs text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Message
                                    </label>
                                    <textarea
                                        id="body"
                                        rows={6}
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        placeholder="Write your message here..."
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                    <div className="mt-1 flex items-center justify-between">
                                        {errors.body ? (
                                            <p className="text-xs text-red-600">{errors.body}</p>
                                        ) : (
                                            <span />
                                        )}
                                        <p className="text-xs text-gray-400">{data.body.length} / 5000</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-1">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { reset(); setActiveTab('inbox'); }}
                                        className="text-sm text-gray-500 hover:text-gray-700 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
