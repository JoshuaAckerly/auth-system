import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const PROJECT_LABELS = {
    'graveyardjokes': 'GraveyardJokes',
    'auth-system':    'Auth System',
    'hollowpress':    'HollowPress',
    'lunarblood':     'Lunar Blood',
    'synthveil':      'Synthveil',
    'thevelvetpulse': 'The Velvet Pulse',
    'velvetradio':    'Velvet Radio',
    'studio':         'Studio',
    'noteleks':       'Noteleks',
};

function StatusDot({ ok }) {
    return ok ? (
        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ) : (
        <svg className="h-4 w-4 text-red-400 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ProjectSection({ project, pages }) {
    const label = PROJECT_LABELS[project] ?? project;
    const total = pages.length;
    const complete = pages.filter((p) => p.title && p.meta_description).length;

    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            {/* Project header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                        {total} pages
                    </span>
                </div>
                <span className="text-xs text-gray-400">
                    {complete}/{total} with title &amp; description
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <tr>
                            <th className="px-4 py-3 text-left">Page</th>
                            <th className="px-4 py-3 text-left">URL</th>
                            <th className="px-3 py-3 text-center">Title</th>
                            <th className="px-3 py-3 text-center">Desc</th>
                            <th className="px-3 py-3 text-center">OG</th>
                            <th className="px-3 py-3 text-center">Schema</th>
                            <th className="px-3 py-3 text-center">Robots</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pages.map((page) => {
                            const isNoindex = page.robots.includes('noindex');
                            return (
                                <tr key={page.page_key} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{page.page_label}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{page.page_url}</td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex justify-center"><StatusDot ok={Boolean(page.title)} /></div>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex justify-center"><StatusDot ok={Boolean(page.meta_description)} /></div>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex justify-center"><StatusDot ok={Boolean(page.og_title && page.og_image)} /></div>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex justify-center"><StatusDot ok={Boolean(page.schema_json)} /></div>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        {isNoindex ? (
                                            <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">noindex</span>
                                        ) : (
                                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">index</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route('admin.seo.edit', page.page_key)}
                                            className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-300 transition hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function SeoIndex({ grouped }) {
    const totalPages = Object.values(grouped).reduce((sum, pages) => sum + pages.length, 0);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    SEO Pages
                </h2>
            }
        >
            <Head title="SEO" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <p className="text-sm text-gray-500">
                        {Object.keys(grouped).length} projects · {totalPages} pages total
                    </p>

                    {Object.entries(grouped).map(([project, pages]) => (
                        <ProjectSection key={project} project={project} pages={pages} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

