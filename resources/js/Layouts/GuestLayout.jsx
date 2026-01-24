import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';


export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[var(--background)] pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-24 w-24" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-[var(--card)] px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
