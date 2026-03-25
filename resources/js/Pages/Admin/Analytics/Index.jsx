import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

function StatCard({ label, value, sub }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white px-6 py-5 shadow-sm">
            <p className="truncate text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value.toLocaleString()}</p>
            {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
    );
}

function BarChart({ data }) {
    const max = Math.max(...data.map((d) => parseInt(d.count)), 1);
    return (
        <div className="flex h-32 items-end gap-1">
            {data.map((d) => {
                const count = parseInt(d.count);
                const height = Math.round((count / max) * 100);
                const label = new Date(d.date + 'T00:00:00').toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                });
                return (
                    <div key={d.date} className="group relative flex-1 h-full flex flex-col justify-end">
                        <div
                            className="w-full rounded-t bg-indigo-400 transition-all"
                            style={{ height: `${height}%` }}
                        />
                        {/* tooltip on hover */}
                        <div className="pointer-events-none absolute bottom-full mb-1 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                            {label}: {count}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function Index({ stats, dailyChart, topPages, topCities, visitsByHost, recentVisits }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Site Analytics
                </h2>
            }
        >
            <Head title="Analytics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        <StatCard label="Total Visits" value={stats.totalVisits} />
                        <StatCard label="Last 30 Days" value={stats.visitsLast30Days} />
                        <StatCard label="Last 7 Days" value={stats.visitsLast7Days} />
                        <StatCard label="Unique IPs (30d)" value={stats.uniqueIpsLast30} />
                        <StatCard
                            label="Logged-in Visits (30d)"
                            value={stats.loggedInLast30}
                            sub={`${stats.visitsLast30Days > 0 ? Math.round((stats.loggedInLast30 / stats.visitsLast30Days) * 100) : 0}% of period`}
                        />
                    </div>

                    {/* Visits by Site */}
                    {visitsByHost.length > 0 && (
                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-medium text-gray-700">Visits by Site (30d)</h3>
                            <div className="flex flex-wrap gap-3">
                                {visitsByHost.map((h) => {
                                    const total = visitsByHost.reduce((s, x) => s + parseInt(x.count), 0);
                                    const pct = total > 0 ? Math.round((parseInt(h.count) / total) * 100) : 0;
                                    return (
                                        <div key={h.host} className="flex flex-1 min-w-[160px] flex-col rounded-lg border border-gray-200 p-4">
                                            <span className="truncate text-sm font-medium text-gray-800">{h.host ?? 'unknown'}</span>
                                            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                                                <div className="h-1.5 rounded-full bg-indigo-400" style={{ width: `${pct}%` }} />
                                            </div>
                                            <div className="mt-1 flex justify-between text-xs text-gray-400">
                                                <span>{parseInt(h.count).toLocaleString()} visits</span>
                                                <span>{pct}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Daily chart */}
                    <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-medium text-gray-700">
                            Daily Visits — Last 14 Days
                        </h3>
                        <BarChart data={dailyChart} />
                        <div className="mt-2 flex justify-between text-xs text-gray-400">
                            <span>
                                {new Date(dailyChart[0]?.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <span>
                                {new Date(dailyChart[dailyChart.length - 1]?.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Top Pages */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm lg:col-span-1">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h3 className="text-sm font-medium text-gray-700">Top Pages (30d)</h3>
                            </div>
                            {topPages.length === 0 ? (
                                <p className="p-6 text-sm text-gray-400">No data yet.</p>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {topPages.map((p) => (
                                        <li key={p.path} className="flex items-center justify-between px-6 py-3">
                                            <span className="max-w-[75%] truncate text-sm text-gray-700">{p.path}</span>
                                            <span className="text-sm font-semibold text-indigo-600">{p.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Top Cities */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm lg:col-span-1">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h3 className="text-sm font-medium text-gray-700">Top Cities (30d)</h3>
                            </div>
                            {topCities.length === 0 ? (
                                <p className="p-6 text-sm text-gray-400">Location data pending…</p>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {topCities.map((c) => (
                                        <li key={`${c.city}-${c.country}`} className="flex items-center justify-between px-6 py-3">
                                            <span className="text-sm text-gray-700">
                                                {c.city}
                                                {c.country && (
                                                    <span className="ml-1.5 text-xs text-gray-400">{c.country}</span>
                                                )}
                                            </span>
                                            <span className="text-sm font-semibold text-indigo-600">{c.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Recent Visits */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="text-sm font-medium text-gray-700">Recent Visits</h3>
                        </div>
                        {recentVisits.length === 0 ? (
                            <p className="p-6 text-sm text-gray-400">No visits recorded yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Visitor
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Site
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Location
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Page
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Browser
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                IP
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {recentVisits.map((v) => (
                                            <tr key={v.id}>
                                                <td className="px-4 py-3">
                                                    {v.user_name ? (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{v.user_name}</p>
                                                            <p className="text-xs text-gray-400">{v.user_email}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">Anonymous</span>
                                                    )}
                                                </td>
                                                <td className="max-w-[160px] truncate px-4 py-3 text-xs text-gray-500">
                                                    {v.host ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {v.city ? (
                                                        <div>
                                                            <p className="text-sm text-gray-700">{v.city}</p>
                                                            <p className="text-xs text-gray-400">{[v.region, v.country].filter(Boolean).join(', ')}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-300">—</span>
                                                    )}
                                                </td>
                                                <td className="max-w-[140px] truncate px-4 py-3 text-sm text-gray-700">
                                                    {v.path}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {v.browser}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-400">
                                                    {v.ip_address}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                                                    {new Date(v.visited_at).toLocaleString()}
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
