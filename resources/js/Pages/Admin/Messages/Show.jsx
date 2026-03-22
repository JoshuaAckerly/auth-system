import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ message }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.messages.index')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &larr; Back
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Message Details
                    </h2>
                </div>
            }
        >
            <Head title={message.title} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${message.type === 'broadcast' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {message.type}
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(message.created_at).toLocaleString()}
                            </span>
                        </div>

                        {message.type === 'individual' && message.user && (
                            <div className="mb-4 text-sm text-gray-600">
                                To: <span className="font-medium">{message.user.name}</span> ({message.user.email})
                            </div>
                        )}

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {message.title}
                        </h3>

                        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                            {message.body}
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Read Receipts ({message.read_count} / {message.recipient_count})
                        </h4>

                        {message.reads && message.reads.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {message.reads.map((read) => (
                                    <li key={read.id} className="flex items-center justify-between py-2">
                                        <span className="text-sm text-gray-700">
                                            {read.user?.name} ({read.user?.email})
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(read.read_at).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400">No one has read this message yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
