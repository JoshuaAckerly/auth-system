import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function StatCard({ label, value, icon, accent }) {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: accent }}
            >
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

function QuickAction({ href, icon, label, description }) {
    return (
        <Link
            href={href}
            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-[var(--primary)] hover:shadow-sm"
        >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600 group-hover:bg-[var(--primary)] group-hover:text-white transition">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
            </div>
        </Link>
    );
}

export default function Dashboard({
    purchases = [],
    sales = [],
    recentMessages = [],
    unreadCount = 0,
    sentMessages = [],
    userInboxCount = 0,
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = auth.is_admin;

    const adminTools = isAdmin
        ? [
              {
                  title: 'Social Schedule',
                  description: 'Review scheduled social posts.',
                  href: route('admin.social-schedule.index'),
                  icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                  ),
              },
              {
                  title: 'Messages',
                  description: 'Send announcements and manage user messages.',
                  href: route('admin.messages.index'),
                  icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                  ),
              },
              {
                  title: 'User Inbox',
                  description: `${userInboxCount} unread message${userInboxCount !== 1 ? 's' : ''} from users.`,
                  href: route('admin.messages.inbox'),
                  badge: userInboxCount > 0 ? userInboxCount : null,
                  icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                  ),
              },
              {
                  title: 'Analytics',
                  description: 'View site traffic and visit reporting.',
                  href: route('admin.analytics'),
                  icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                  ),
              },
              {
                  title: 'SEO',
                  description: 'Edit page metadata and search settings.',
                  href: route('admin.seo.index'),
                  icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                  ),
              },
          ]
        : [];

    const totalSpent = purchases.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
    const lastSale = sales.length > 0 ? new Date(sales[0].created_at).toLocaleDateString() : null;

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">

                    {/* Hero greeting */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {greeting()}, {user.name.split(' ')[0]} 👋
                            </h1>
                            <p className="mt-1 text-sm text-white/70">
                                Here&apos;s what&apos;s happening with your account today.
                            </p>
                        </div>
                        {!isAdmin && (
                            <Link
                                href={route('messages.index')}
                                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 transition sm:mt-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Messages
                                {unreadCount > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>

                    {/* Stats row */}
                    {isAdmin ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                label="Total Sales"
                                value={sales.length}
                                accent="oklch(0.55 0.18 145)"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                label="Total Revenue"
                                value={`$${totalRevenue.toFixed(2)}`}
                                accent="oklch(0.55 0.18 260)"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                label="User Messages (unread)"
                                value={userInboxCount}
                                accent="oklch(0.55 0.18 30)"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                }
                            />
                            <StatCard
                                label="Last Sale"
                                value={lastSale ?? '—'}
                                accent="oklch(0.55 0.18 320)"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                label="Total Orders"
                                value={purchases.length}
                                accent="oklch(0.55 0.18 145)"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                label="Total Spent"
                                value={`$${totalSpent.toFixed(2)}`}
                                accent="oklch(0.55 0.18 260)"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                label="Unread Messages"
                                value={unreadCount}
                                accent={unreadCount > 0 ? 'oklch(0.55 0.18 30)' : 'oklch(0.65 0 0)'}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                }
                            />
                            <StatCard
                                label="Member Since"
                                value={new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                accent="oklch(0.55 0.18 320)"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* Left column: Account card + tools/actions */}
                        <div className="flex flex-col gap-6">

                            {/* Account card */}
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white text-2xl font-bold select-none">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-base font-bold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {isAdmin ? 'Admin' : 'Member'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-5 border-t pt-4 grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">Joined</p>
                                        <p className="mt-0.5 text-sm font-medium text-gray-700">
                                            {new Date(user.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                                        <p className="mt-0.5 text-sm font-medium text-green-600">Active</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Edit Profile
                                    </Link>
                                    {!isAdmin && (
                                        <Link
                                            href={route('messages.index')}
                                            className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-center text-sm font-medium text-white hover:opacity-90 transition"
                                        >
                                            Messages {unreadCount > 0 && `(${unreadCount})`}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Admin tools or user quick actions */}
                            {isAdmin ? (
                                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Admin Tools
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {adminTools.map((tool) => (
                                            <Link
                                                key={tool.title}
                                                href={tool.href}
                                                className="group flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 transition hover:border-[var(--primary)] hover:bg-gray-50"
                                            >
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600 group-hover:bg-[var(--primary)] group-hover:text-white transition">
                                                    {tool.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900">{tool.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                                                </div>
                                                {tool.badge && (
                                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                                                        {tool.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Quick Actions
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <QuickAction
                                            href={route('messages.index')}
                                            label="Send a Message"
                                            description="Get in touch with the team."
                                            icon={
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                            }
                                        />
                                        <QuickAction
                                            href={route('profile.edit')}
                                            label="Update Profile"
                                            description="Edit your name, email, and password."
                                            icon={
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Main content (2/3 width) */}
                        <div className="flex flex-col gap-6 lg:col-span-2">

                            {/* Inbox preview */}
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Inbox</p>
                                        {unreadCount > 0 && (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    {!isAdmin && (
                                        <Link href={route('messages.index')} className="text-xs font-medium text-gray-400 hover:text-gray-700 transition">
                                            View all →
                                        </Link>
                                    )}
                                </div>

                                {recentMessages.length === 0 ? (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-500">No messages yet</p>
                                        <p className="text-xs text-gray-400 mt-1">Announcements and personal messages will appear here.</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-50">
                                        {recentMessages.map((msg) => (
                                            <li key={msg.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                                                <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${msg.is_read ? 'bg-gray-200' : 'bg-green-500'}`} />
                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-sm ${msg.is_read ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
                                                        {msg.title}
                                                    </p>
                                                    {msg.body && (
                                                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{msg.body}</p>
                                                    )}
                                                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                                        <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${msg.type === 'broadcast' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {msg.type === 'broadcast' ? 'Announcement' : 'Personal'}
                                                        </span>
                                                        {new Date(msg.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Sent messages preview (non-admin) */}
                            {!isAdmin && sentMessages.length > 0 && (
                                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Messages Sent</p>
                                        </div>
                                        <Link href={route('messages.index')} className="text-xs font-medium text-gray-400 hover:text-gray-700 transition">
                                            View all →
                                        </Link>
                                    </div>
                                    <ul className="divide-y divide-gray-50">
                                        {sentMessages.map((msg) => (
                                            <li key={msg.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{msg.subject}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(msg.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${msg.is_read ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                                    {msg.is_read ? 'Read' : 'Pending'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Order / Sales history */}
                            {isAdmin ? (
                                sales.length > 0 && (
                                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Recent Sales</p>
                                        <div className="overflow-x-auto -mx-6 px-6">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</th>
                                                        <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Item</th>
                                                        <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Amount</th>
                                                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {sales.slice(0, 10).map((sale) => (
                                                        <tr key={sale.id}>
                                                            <td className="py-3 pr-6 font-medium text-gray-900">{sale.user_name}</td>
                                                            <td className="py-3 pr-6 text-gray-600">{sale.item || '—'}</td>
                                                            <td className="py-3 pr-6 font-semibold text-gray-900">${parseFloat(sale.amount || 0).toFixed(2)}</td>
                                                            <td className="py-3 text-gray-500">{sale.created_at ? new Date(sale.created_at).toLocaleDateString() : '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            ) : (
                                purchases.length > 0 && (
                                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Order History</p>
                                        <div className="overflow-x-auto -mx-6 px-6">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Item</th>
                                                        <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Amount</th>
                                                        <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Transaction</th>
                                                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {purchases.map((purchase) => (
                                                        <tr key={purchase.id}>
                                                            <td className="py-3 pr-6 font-medium text-gray-900">{purchase.item || '—'}</td>
                                                            <td className="py-3 pr-6 font-semibold text-gray-900">${parseFloat(purchase.amount || 0).toFixed(2)}</td>
                                                            <td className="py-3 pr-6 font-mono text-xs text-gray-400">{purchase.paypal_transaction_id || '—'}</td>
                                                            <td className="py-3 text-gray-500">{purchase.created_at ? new Date(purchase.created_at).toLocaleDateString() : '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            )}

                            {/* Empty state */}
                            {(isAdmin ? sales.length === 0 : purchases.length === 0) &&
                                recentMessages.length === 0 &&
                                sentMessages.length === 0 && (
                                <div className="rounded-xl bg-white p-12 shadow-sm border border-gray-100 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-gray-700">Nothing here yet</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {isAdmin ? 'Sales and messages will appear here once activity begins.' : 'Your purchases and messages will appear here.'}
                                    </p>
                                    {!isAdmin && (
                                        <Link
                                            href={route('messages.index')}
                                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                                        >
                                            Send us a message
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
