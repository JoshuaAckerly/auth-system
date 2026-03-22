import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ messages }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Messages
                    </h2>
                    <Link
                        href={route('admin.messages.create')}
                        className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        New Message
                    </Link>
                </div>
            }
        >
            <Head title="Admin Messages" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {messages.data.length === 0 ? (
                            <div className="p-6 text-gray-500">
                                No messages sent yet.
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Recipient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Read
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Sent
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {messages.data.map((message) => (
                                        <tr key={message.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Link
                                                    href={route('admin.messages.show', message.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {message.title}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${message.type === 'broadcast' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {message.type}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {message.type === 'broadcast' ? 'All users' : (message.recipient_name || '—')}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {message.read_count} / {message.recipient_count}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {new Date(message.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {messages.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
                                <div className="text-sm text-gray-500">
                                    Page {messages.current_page} of {messages.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {messages.prev_page_url && (
                                        <Link
                                            href={messages.prev_page_url}
                                            className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {messages.next_page_url && (
                                        <Link
                                            href={messages.next_page_url}
                                            className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                                        >
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
