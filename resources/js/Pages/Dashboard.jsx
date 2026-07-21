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

export default function Dashboard({ purchases = [], recentMessages = [], unreadCount = 0 }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const adminTools = auth.is_admin
        ? [
              {
                  title: 'Social Schedule',
                  description: 'Review scheduled social posts and posting status.',
                  href: route('admin.social-schedule.index'),
              },
              {
                  title: 'Messages',
                  description: 'Send announcements and manage user messages.',
                  href: route('admin.messages.index'),
              },
              {
                  title: 'Analytics',
                  description: 'View site traffic and visit reporting.',
                  href: route('admin.analytics'),
              },
              {
                  title: 'SEO',
                  description: 'Edit page metadata and search settings.',
                  href: route('admin.seo.index'),
              },
          ]
        : [];

    const totalSpent = purchases.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const lastPurchase =
        purchases.length > 0
            ? new Date(purchases[purchases.length - 1].created_at).toLocaleDateString()
            : null;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Row 1: Account Summary + Purchase Stats */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                        {/* Account Summary Card */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white text-xl font-bold select-none">
                                    {getInitials(user.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg font-semibold text-gray-900 truncate">{user.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="border-t pt-3">
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Member since</p>
                                <p className="mt-0.5 text-sm font-medium text-gray-700">
                                    {new Date(user.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Purchase Stats */}
                        <div className="md:col-span-2 overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">
                                Purchase Summary
                            </p>
                            <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
                                <div className="px-4">
                                    <p className="text-3xl font-bold text-gray-900">{purchases.length}</p>
                                    <p className="text-xs text-gray-500 mt-1">Total Orders</p>
                                </div>
                                <div className="px-4">
                                    <p className="text-3xl font-bold text-gray-900">
                                        ${totalSpent.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Total Spent</p>
                                </div>
                                <div className="px-4">
                                    <p className="text-xl font-bold text-gray-900">
                                        {lastPurchase ?? '—'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Last Purchase</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {adminTools.length > 0 && (
                        <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Admin Tools
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Quick links for managing Graveyard Jokes Studios.
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {adminTools.map((tool) => (
                                    <Link
                                        key={tool.title}
                                        href={tool.href}
                                        className="block rounded-md border border-gray-200 p-4 transition hover:border-gray-300 hover:bg-gray-50"
                                    >
                                        <p className="font-semibold text-gray-900">{tool.title}</p>
                                        <p className="mt-2 text-sm leading-5 text-gray-500">
                                            {tool.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Row 2: Messages Inbox */}
                    {recentMessages.length > 0 && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Messages
                                </p>
                                {unreadCount > 0 && (
                                    <span className="ml-auto inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {recentMessages.map((msg) => (
                                    <li key={msg.id} className="flex items-start gap-3 py-3">
                                        <span
                                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                msg.is_read ? 'bg-gray-300' : 'bg-green-500'
                                            }`}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`text-sm ${
                                                    msg.is_read
                                                        ? 'text-gray-600'
                                                        : 'font-semibold text-gray-900'
                                                }`}
                                            >
                                                {msg.title}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {msg.type === 'broadcast' ? 'Announcement' : 'Personal'} ·{' '}
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Row 3: Order History */}
                    {purchases.length > 0 && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                                Order History
                            </p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="pb-3 pr-6 text-xs font-semibold text-gray-400 uppercase tracking-wide">Item</th>
                                            <th className="pb-3 pr-6 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                                            <th className="pb-3 pr-6 text-xs font-semibold text-gray-400 uppercase tracking-wide">PayPal Transaction ID</th>
                                            <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {purchases.map((purchase) => (
                                            <tr key={purchase.id}>
                                                <td className="py-3 pr-6 font-medium text-gray-900">{purchase.item || '—'}</td>
                                                <td className="py-3 pr-6 text-gray-700">
                                                    ${parseFloat(purchase.amount || 0).toFixed(2)}
                                                </td>
                                                <td className="py-3 pr-6 font-mono text-xs text-gray-500">
                                                    {purchase.paypal_transaction_id || '—'}
                                                </td>
                                                <td className="py-3 text-gray-500">
                                                    {purchase.created_at
                                                        ? new Date(purchase.created_at).toLocaleDateString()
                                                        : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {purchases.length === 0 && recentMessages.length === 0 && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 text-center text-gray-500 text-sm">
                            No purchases or messages yet.
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
