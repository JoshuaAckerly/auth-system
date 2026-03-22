import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ users }) {
    const [type, setType] = useState('individual');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body: '',
        type: 'individual',
        user_id: '',
    });

    function handleTypeChange(newType) {
        setType(newType);
        setData('type', newType);
        if (newType === 'broadcast') {
            setData('user_id', '');
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.messages.store'));
    }

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
                        New Message
                    </h2>
                </div>
            }
        >
            <Head title="New Message" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message Type
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('individual')}
                                        className={`rounded-md px-4 py-2 text-sm font-medium ${type === 'individual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Individual
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('broadcast')}
                                        className={`rounded-md px-4 py-2 text-sm font-medium ${type === 'broadcast' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Broadcast (All Users)
                                    </button>
                                </div>
                            </div>

                            {type === 'individual' && (
                                <div>
                                    <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                                        Recipient
                                    </label>
                                    <select
                                        id="user_id"
                                        value={data.user_id}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select a user...</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.user_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    maxLength={255}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message Body
                                </label>
                                <textarea
                                    id="body"
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    rows={6}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    maxLength={5000}
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    {data.body.length} / 5000
                                </p>
                                {errors.body && (
                                    <p className="mt-1 text-sm text-red-600">{errors.body}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link
                                    href={route('admin.messages.index')}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                                >
                                    {processing ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
