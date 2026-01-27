import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { purchases = [] } = usePage().props;
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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                        {/* Purchases table below */}
                        {purchases.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold mb-2">Your Purchases</h3>
                                <table className="min-w-full border text-sm">
                                    <thead>
                                        <tr>
                                            <th className="border px-2 py-1">Item</th>
                                            <th className="border px-2 py-1">Amount</th>
                                            <th className="border px-2 py-1">PayPal Transaction ID</th>
                                            <th className="border px-2 py-1">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchases.map((purchase) => (
                                            <tr key={purchase.id}>
                                                <td className="border px-2 py-1">{purchase.item_name || '-'}</td>
                                                <td className="border px-2 py-1">{purchase.amount || '-'}</td>
                                                <td className="border px-2 py-1">{purchase.paypal_transaction_id || '-'}</td>
                                                <td className="border px-2 py-1">{purchase.created_at ? new Date(purchase.created_at).toLocaleString() : '-'}</td>
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
