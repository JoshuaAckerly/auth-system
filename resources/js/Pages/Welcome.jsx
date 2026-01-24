
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
                <ApplicationLogo className="h-32 w-32 mb-8" />
                <h1 className="text-4xl font-bold mb-4">Welcome to GraveYardJokes Auth System</h1>
                <p className="mb-8 text-lg text-center max-w-xl">Secure authentication for all your GraveYardJokes projects. Please log in or register to continue.</p>
                <div className="flex gap-4">
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="px-6 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow hover:opacity-90">Dashboard</Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="px-6 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow hover:opacity-90">Log in</Link>
                            <Link href={route('register')} className="px-6 py-2 rounded bg-[var(--secondary)] text-[var(--secondary-foreground)] font-semibold shadow hover:opacity-90">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
