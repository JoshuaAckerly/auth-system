import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const statusOptions = ['all', 'pending', 'processing', 'posted', 'failed', 'cancelled'];
const platformOptions = ['all', 'discord', 'facebook', 'google_business', 'instagram', 'twitter'];

function StatCard({ label, value }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white px-6 py-5 shadow-sm">
            <p className="truncate text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value.toLocaleString()}</p>
        </div>
    );
}

function formatDate(value) {
    if (!value) return 'Not set';

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

function statusClass(status) {
    if (status === 'posted') return 'bg-green-100 text-green-800';
    if (status === 'failed') return 'bg-red-100 text-red-800';
    if (status === 'processing') return 'bg-blue-100 text-blue-800';
    if (status === 'cancelled') return 'bg-gray-100 text-gray-700';

    return 'bg-amber-100 text-amber-800';
}

export default function Index({ posts, stats, apiError, sourceUrl }) {
    const [statusFilter, setStatusFilter] = useState('pending');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [query, setQuery] = useState('');

    const filteredPosts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return posts.filter((post) => {
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
            const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
            const haystack = `${post.id} ${post.platform} ${post.status} ${post.content} ${post.media_url ?? ''} ${post.error_message ?? ''}`.toLowerCase();

            return matchesStatus && matchesPlatform && (!normalizedQuery || haystack.includes(normalizedQuery));
        });
    }, [posts, platformFilter, query, statusFilter]);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Social Schedule</h2>
                    <p className="mt-1 text-sm text-gray-500">Graveyard Jokes scheduled social posts</p>
                </div>
            }
        >
            <Head title="Social Schedule" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {apiError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
                            {apiError}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
                        <StatCard label="Total" value={stats.total} />
                        <StatCard label="Pending" value={stats.pending} />
                        <StatCard label="Posted" value={stats.posted} />
                        <StatCard label="Failed" value={stats.failed} />
                        <StatCard label="Processing" value={stats.processing} />
                        <StatCard label="Cancelled" value={stats.cancelled} />
                        <StatCard label="Due Now" value={stats.overdue_pending} />
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search posts"
                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />

                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={platformFilter}
                                onChange={(event) => setPlatformFilter(event.target.value)}
                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {platformOptions.map((platform) => (
                                    <option key={platform} value={platform}>
                                        {platform}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p className="mt-3 text-xs text-gray-400">Source: {sourceUrl}</p>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {filteredPosts.length === 0 ? (
                            <div className="p-6 text-gray-500">No posts match the current filters.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Platform</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Scheduled</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Content</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Media</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {filteredPosts.map((post) => (
                                            <tr key={post.id} className={post.is_overdue ? 'bg-red-50' : undefined}>
                                                <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-gray-500">#{post.id}</td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm capitalize text-gray-700">{post.platform}</td>
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusClass(post.status)}`}>
                                                        {post.status}
                                                    </span>
                                                    {post.is_overdue && <p className="mt-1 text-xs font-medium text-red-600">Due now</p>}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                                    {formatDate(post.scheduled_at)}
                                                    {post.status === 'posted' && post.posted_at && <p className="mt-1 text-xs text-green-600">Posted {formatDate(post.posted_at)}</p>}
                                                </td>
                                                <td className="max-w-xl px-4 py-4 text-sm text-gray-700">
                                                    <p className="whitespace-pre-wrap leading-6">{post.content}</p>
                                                    {post.error_message && (
                                                        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                                            {post.error_message}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                                    {post.media_url ? (
                                                        <a
                                                            href={post.media_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Open media
                                                        </a>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}