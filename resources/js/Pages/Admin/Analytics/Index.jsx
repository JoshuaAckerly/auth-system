import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

function StatCard({ label, value, sub }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white px-4 py-3 shadow-sm">
            <p className="truncate text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-0.5 text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
            {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
        </div>
    );
}

function ChevronIcon({ open }) {
    return (
        <svg
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
    );
}

// Collapsible card — open/closed state persists per-section across visits via localStorage
function Section({ id, title, subtitle, badge, defaultOpen = true, children }) {
    const storageKey = `gj-analytics-${id}`;
    const [open, setOpen] = React.useState(() => {
        if (typeof window === 'undefined') return defaultOpen;
        const stored = window.localStorage.getItem(storageKey);
        return stored === null ? defaultOpen : stored === '1';
    });

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(storageKey, open ? '1' : '0');
        }
    }, [open, storageKey]);

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
                <div className="min-w-0">
                    <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                    {subtitle && <p className="mt-0.5 truncate text-xs text-gray-400">{subtitle}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {badge}
                    <ChevronIcon open={open} />
                </div>
            </button>
            {open && <div className="border-t border-gray-100">{children}</div>}
        </div>
    );
}

function BarChart({ data }) {
    const max = Math.max(...data.map((d) => parseInt(d.count)), 1);
    return (
        <div className="flex h-24 items-end gap-1">
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
                            className="w-full rounded-t bg-indigo-400 transition-all group-hover:bg-indigo-500"
                            style={{ height: `${height}%` }}
                        />
                        {/* tooltip on hover */}
                        <div className="pointer-events-none absolute bottom-full z-10 mb-1 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                            {label}: {count}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const DONUT_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#ef4444', '#14b8a6', '#a855f7', '#f97316', '#84cc16', '#0ea5e9', '#eab308'];

// r=15.9155 makes the circumference exactly 100, so strokeDasharray can use raw percentages
function DonutChart({ data }) {
    const total = data.reduce((s, d) => s + parseInt(d.count), 0) || 1;
    const radius = 15.9155;
    let acc = 0;

    return (
        <svg viewBox="0 0 36 36" className="h-28 w-28 shrink-0 -rotate-90">
            <circle cx="18" cy="18" r={radius} fill="transparent" stroke="#f3f4f6" strokeWidth="6" />
            {data.map((d, i) => {
                const pct = (parseInt(d.count) / total) * 100;
                const circle = (
                    <circle
                        key={d.host ?? i}
                        cx="18"
                        cy="18"
                        r={radius}
                        fill="transparent"
                        stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                        strokeWidth="6"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset={-acc}
                    />
                );
                acc += pct;
                return circle;
            })}
        </svg>
    );
}

const CONTACT_PAGES = ['/contact', '/services', '/pricing', '/work-with-us', '/hire', '/get-started'];

function heatLabel(count) {
    if (count >= 10) return { label: 'Very Hot', cls: 'bg-red-100 text-red-700' };
    if (count >= 6)  return { label: 'Hot',      cls: 'bg-orange-100 text-orange-700' };
    return               { label: 'Warm',     cls: 'bg-amber-100 text-amber-700' };
}

function PotentialClientRow({ client }) {
    const [open, setOpen] = React.useState(false);
    const location = [client.city, client.region, client.country].filter(Boolean).join(', ');
    const heat = heatLabel(client.visit_count);
    const touchedContact = client.pages.some((p) => CONTACT_PAGES.some((cp) => p.startsWith(cp)));

    return (
        <>
            <tr className="cursor-pointer hover:bg-gray-50" onClick={() => setOpen((o) => !o)}>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">{client.ip_address}</td>
                <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${heat.cls}`}>
                        {heat.label}
                    </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{client.visit_count.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{client.unique_pages}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{location || '—'}</td>
                <td className="px-4 py-3">
                    {touchedContact && (
                        <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                            Contact interest
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                    {client.last_seen ? new Date(client.last_seen).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-center text-xs text-indigo-500 select-none">{open ? '▲' : '▼'}</td>
            </tr>
            {open && (
                <tr>
                    <td colSpan={8} className="bg-gray-50 px-6 py-3">
                        <p className="mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Pages visited</p>
                        <div className="flex flex-wrap gap-2">
                            {client.pages.length > 0
                                ? client.pages.map((p) => (
                                      <span key={p} className="rounded bg-white border border-gray-200 px-2 py-0.5 font-mono text-xs text-gray-600">
                                          {p}
                                      </span>
                                  ))
                                : <span className="text-xs text-gray-400">—</span>}
                        </div>
                        <p className="mt-2 text-xs text-gray-400">
                            First visit: {client.first_seen ? new Date(client.first_seen).toLocaleString() : '—'}
                        </p>
                    </td>
                </tr>
            )}
        </>
    );
}

export default function Index({ stats, dailyChart, topPages, topCities, visitsByHost, recentVisits, socialVisits, socialSummary, potentialClients = [] }) {
    const hostTotal = visitsByHost.reduce((s, x) => s + parseInt(x.count), 0) || 1;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Site Analytics
                </h2>
            }
        >
            <Head title="Analytics" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-8">

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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

                    {/* Trend + Site distribution */}
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Section id="daily-trend" title="Daily Visits" subtitle="Last 14 days">
                            <div className="p-4">
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
                        </Section>

                        {visitsByHost.length > 0 && (
                            <Section id="visits-by-site" title="Visits by Site" subtitle="Last 30 days">
                                <div className="flex flex-col items-center gap-4 p-4 sm:flex-row">
                                    <DonutChart data={visitsByHost} />
                                    <ul className="w-full min-w-0 divide-y divide-gray-100">
                                        {visitsByHost.map((h, i) => {
                                            const pct = Math.round((parseInt(h.count) / hostTotal) * 100);
                                            return (
                                                <li key={h.host} className="flex items-center justify-between gap-2 py-1.5 text-sm">
                                                    <span className="flex min-w-0 items-center gap-2">
                                                        <span
                                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                            style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                                                        />
                                                        <span className="truncate text-gray-700">{h.host ?? 'unknown'}</span>
                                                    </span>
                                                    <span className="shrink-0 text-xs text-gray-400">
                                                        {parseInt(h.count).toLocaleString()} · {pct}%
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </Section>
                        )}
                    </div>

                    {/* Top Pages / Top Cities */}
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Section id="top-pages" title="Top Pages" subtitle="Last 30 days">
                            {topPages.length === 0 ? (
                                <p className="p-4 text-sm text-gray-400">No data yet.</p>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {topPages.map((p) => (
                                        <li key={p.path} className="flex items-center justify-between px-4 py-2.5">
                                            <div className="max-w-[75%] truncate">
                                                <span className="block truncate text-sm text-gray-700">{p.path}</span>
                                                {p.last_visited && (
                                                    <span className="text-[11px] text-gray-400">
                                                        {new Date(p.last_visited).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-indigo-600">{p.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>

                        <Section id="top-cities" title="Top Cities" subtitle="Last 30 days">
                            {topCities.length === 0 ? (
                                <p className="p-4 text-sm text-gray-400">Location data pending…</p>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {topCities.map((c) => (
                                        <li key={`${c.city}-${c.country}`} className="flex items-center justify-between px-4 py-2.5">
                                            <div>
                                                <span className="text-sm text-gray-700">
                                                    {c.city}
                                                    {c.country && (
                                                        <span className="ml-1.5 text-xs text-gray-400">{c.country}</span>
                                                    )}
                                                </span>
                                                {c.last_visited && (
                                                    <span className="block text-[11px] text-gray-400">
                                                        {new Date(c.last_visited).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-indigo-600">{c.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>
                    </div>

                    {/* Potential Clients */}
                    <Section
                        id="potential-clients"
                        title="Potential Clients"
                        subtitle="Returning visitors to graveyardjokes.com — 3+ visits in the last 90 days"
                        badge={
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                {potentialClients.length} leads
                            </span>
                        }
                    >
                        {potentialClients.length === 0 ? (
                            <p className="p-4 text-sm text-gray-400">No returning visitors yet — check back after more traffic.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">IP Address</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Heat</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Visits</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Unique Pages</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Signal</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Visit</th>
                                            <th className="px-4 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {potentialClients.map((client) => (
                                            <PotentialClientRow key={client.ip_address} client={client} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Section>

                    {/* Social Referrals */}
                    {socialVisits && socialVisits.length > 0 && (
                        <Section
                            id="social-referrals"
                            title="Social Referrals"
                            subtitle="Last 30 days"
                            badge={<span className="text-xs text-gray-400">{socialVisits.length} visits</span>}
                            defaultOpen={false}
                        >
                            {/* Platform summary */}
                            {socialSummary && Object.keys(socialSummary).length > 0 && (
                                <div className="flex flex-wrap gap-3 px-4 py-3 border-b border-gray-100">
                                    {Object.entries(socialSummary).map(([platform, count]) => (
                                        <div key={platform} className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1">
                                            <span className="text-sm font-medium text-indigo-700">{platform}</span>
                                            <span className="text-xs font-semibold text-indigo-500">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Individual visits */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Platform</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Site</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Page</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {socialVisits.map((v, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                                        {v.platform}
                                                    </span>
                                                </td>
                                                <td className="max-w-[160px] truncate px-4 py-3 text-xs text-gray-500">{v.host ?? '—'}</td>
                                                <td className="max-w-[160px] truncate px-4 py-3 text-sm text-gray-700">{v.path}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {[v.city, v.country].filter(Boolean).join(', ') || '—'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                                                    {new Date(v.visited_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>
                    )}

                    {/* Recent Visits */}
                    <Section id="recent-visits" title="Recent Visits" defaultOpen={false}>
                        {recentVisits.length === 0 ? (
                            <p className="p-4 text-sm text-gray-400">No visits recorded yet.</p>
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
                    </Section>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
