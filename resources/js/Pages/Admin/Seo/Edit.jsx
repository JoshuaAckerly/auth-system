import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const ROBOTS_OPTIONS = ['index,follow', 'index,nofollow', 'noindex,follow', 'noindex,nofollow'];
const CHANGE_FREQ_OPTIONS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
const TWITTER_CARD_OPTIONS = ['summary', 'summary_large_image'];

function Field({ label, hint, children }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {children}
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

function Input(props) {
    const { className, ...rest } = props;
    return (
        <input
            {...rest}
            className={`w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className ?? ''}`}
        />
    );
}

function Textarea({ className, ...props }) {
    return (
        <textarea
            {...props}
            className={`w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className ?? ''}`}
        />
    );
}

function Select({ options, className, ...rest }) {
    return (
        <select
            {...rest}
            className={`w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className ?? ''}`}
        >
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    );
}

export default function SeoEdit({ page, gscConfigured }) {
    const flash = usePage().props.flash?.success;

    const [tab, setTab] = useState('core');
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState(page.title ?? '');
    const [metaDescription, setMetaDescription] = useState(page.meta_description ?? '');
    const [canonicalUrl, setCanonicalUrl] = useState(page.canonical_url ?? '');
    const [robots, setRobots] = useState(page.robots);
    const [sitemapPriority, setSitemapPriority] = useState(String(page.sitemap_priority));
    const [sitemapChangeFreq, setSitemapChangeFreq] = useState(page.sitemap_change_freq);

    const [ogTitle, setOgTitle] = useState(page.og_title ?? '');
    const [ogDescription, setOgDescription] = useState(page.og_description ?? '');
    const [ogImage, setOgImage] = useState(page.og_image ?? '');
    const [ogType, setOgType] = useState(page.og_type);
    const [twitterCard, setTwitterCard] = useState(page.twitter_card);
    const [twitterTitle, setTwitterTitle] = useState(page.twitter_title ?? '');
    const [twitterDescription, setTwitterDescription] = useState(page.twitter_description ?? '');
    const [twitterImage, setTwitterImage] = useState(page.twitter_image ?? '');

    const [schemaJson, setSchemaJson] = useState(page.schema_json ? JSON.stringify(page.schema_json, null, 2) : '');
    const [schemaError, setSchemaError] = useState(null);

    // GSC state
    const [gscRows, setGscRows] = useState([]);
    const [gscLoading, setGscLoading] = useState(false);
    const [gscError, setGscError] = useState(null);
    const gscFetched = useRef(false);

    useEffect(() => {
        if (tab === 'gsc' && gscConfigured && !gscFetched.current) {
            gscFetched.current = true;
            setGscLoading(true);
            fetch(`/admin/seo/${page.page_key}/gsc`)
                .then((r) => r.json())
                .then((data) => {
                    if (data.error) {
                        setGscError(data.error);
                    } else {
                        setGscRows(data.rows ?? []);
                    }
                })
                .catch(() => setGscError('Failed to load Search Console data.'))
                .finally(() => setGscLoading(false));
        }
    }, [tab, gscConfigured, page.page_key]);

    const validateSchema = () => {
        if (!schemaJson.trim()) {
            setSchemaError(null);
            return true;
        }
        try {
            JSON.parse(schemaJson);
            setSchemaError(null);
            return true;
        } catch {
            setSchemaError('Invalid JSON — please fix before saving.');
            return false;
        }
    };

    const handleSave = () => {
        if (!validateSchema()) {
            setTab('schema');
            return;
        }
        setSaving(true);
        router.put(
            route('admin.seo.update', page.page_key),
            {
                title: title || null,
                meta_description: metaDescription || null,
                canonical_url: canonicalUrl || null,
                robots,
                og_title: ogTitle || null,
                og_description: ogDescription || null,
                og_image: ogImage || null,
                og_type: ogType || 'website',
                twitter_card: twitterCard,
                twitter_title: twitterTitle || null,
                twitter_description: twitterDescription || null,
                twitter_image: twitterImage || null,
                schema_json: schemaJson.trim() || null,
                sitemap_priority: parseFloat(sitemapPriority),
                sitemap_change_freq: sitemapChangeFreq,
            },
            { onFinish: () => setSaving(false) },
        );
    };

    const TABS = [
        { id: 'core', label: 'Core' },
        { id: 'social', label: 'Social' },
        { id: 'schema', label: 'JSON-LD' },
        { id: 'gsc', label: 'Search Console' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    SEO — {page.page_label}
                </h2>
            }
        >
            <Head title={`SEO — ${page.page_label}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
                    {/* Back + page info */}
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.seo.index')} className="text-sm text-gray-500 hover:text-gray-700">
                            ← All pages
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-sm text-gray-600">
                            {page.page_label}
                            <span className="ml-2 text-gray-400">{page.page_url}</span>
                        </span>
                    </div>

                    {flash && (
                        <div className="rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700">{flash}</div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                        {TABS.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={`flex flex-1 items-center justify-center rounded px-3 py-2 text-sm font-medium transition ${
                                    tab === id
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Tab panels */}
                    <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        {tab === 'core' && (
                            <>
                                <Field label="Page Title" hint="Aim for 50–60 characters">
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" maxLength={255} />
                                    <p className="mt-1 text-right text-xs text-gray-400">{title.length}/60</p>
                                </Field>
                                <Field label="Meta Description" hint="Aim for 120–160 characters">
                                    <Textarea
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        rows={3}
                                        placeholder="Page description"
                                        maxLength={500}
                                    />
                                    <p className="mt-1 text-right text-xs text-gray-400">{metaDescription.length}/160</p>
                                </Field>
                                <Field label="Canonical URL">
                                    <Input
                                        type="url"
                                        value={canonicalUrl}
                                        onChange={(e) => setCanonicalUrl(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </Field>
                                <div className="grid grid-cols-3 gap-4">
                                    <Field label="Robots">
                                        <Select value={robots} onChange={(e) => setRobots(e.target.value)} options={ROBOTS_OPTIONS} />
                                    </Field>
                                    <Field label="Sitemap Priority">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={sitemapPriority}
                                            onChange={(e) => setSitemapPriority(e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Change Frequency">
                                        <Select
                                            value={sitemapChangeFreq}
                                            onChange={(e) => setSitemapChangeFreq(e.target.value)}
                                            options={CHANGE_FREQ_OPTIONS}
                                        />
                                    </Field>
                                </div>
                            </>
                        )}

                        {tab === 'social' && (
                            <>
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Open Graph</p>
                                <Field label="OG Title">
                                    <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="OG title" maxLength={255} />
                                </Field>
                                <Field label="OG Description">
                                    <Textarea
                                        value={ogDescription}
                                        onChange={(e) => setOgDescription(e.target.value)}
                                        rows={2}
                                        placeholder="OG description"
                                        maxLength={500}
                                    />
                                </Field>
                                <Field label="OG Image URL">
                                    <Input
                                        type="url"
                                        value={ogImage}
                                        onChange={(e) => setOgImage(e.target.value)}
                                        placeholder="https://..."
                                    />
                                    {ogImage && (
                                        <img
                                            src={ogImage}
                                            alt="OG preview"
                                            className="mt-2 h-24 w-full rounded object-cover opacity-70"
                                            onError={(e) => (e.target.style.display = 'none')}
                                        />
                                    )}
                                </Field>
                                <Field label="OG Type">
                                    <Input value={ogType} onChange={(e) => setOgType(e.target.value)} placeholder="website" maxLength={50} />
                                </Field>

                                <div className="mt-2 border-t border-gray-200 pt-4">
                                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Twitter Card</p>
                                    <Field label="Twitter Card Type">
                                        <Select
                                            value={twitterCard}
                                            onChange={(e) => setTwitterCard(e.target.value)}
                                            options={TWITTER_CARD_OPTIONS}
                                        />
                                    </Field>
                                    <Field label="Twitter Title">
                                        <Input
                                            value={twitterTitle}
                                            onChange={(e) => setTwitterTitle(e.target.value)}
                                            placeholder="Twitter title"
                                            maxLength={255}
                                        />
                                    </Field>
                                    <Field label="Twitter Description">
                                        <Textarea
                                            value={twitterDescription}
                                            onChange={(e) => setTwitterDescription(e.target.value)}
                                            rows={2}
                                            placeholder="Twitter description"
                                            maxLength={500}
                                        />
                                    </Field>
                                    <Field label="Twitter Image URL">
                                        <Input
                                            type="url"
                                            value={twitterImage}
                                            onChange={(e) => setTwitterImage(e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </Field>
                                </div>
                            </>
                        )}

                        {tab === 'schema' && (
                            <>
                                <p className="text-sm text-gray-500">
                                    Enter valid JSON-LD structured data. Leave blank to omit the schema script from this page.
                                </p>
                                <Textarea
                                    value={schemaJson}
                                    onChange={(e) => setSchemaJson(e.target.value)}
                                    onBlur={validateSchema}
                                    rows={16}
                                    placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}'}
                                    className="font-mono text-xs"
                                />
                                {schemaError && <p className="text-sm text-red-500">{schemaError}</p>}
                            </>
                        )}

                        {tab === 'gsc' && (
                            <div className="space-y-4">
                                {!gscConfigured ? (
                                    <div className="rounded border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-700">
                                        <p className="font-semibold">Google Search Console not configured.</p>
                                        <p className="mt-1 text-yellow-600">
                                            Run <code className="rounded bg-yellow-100 px-1">php artisan gsc:authorize</code> and add the env vars to
                                            enable this tab.
                                        </p>
                                    </div>
                                ) : gscLoading ? (
                                    <p className="text-sm text-gray-400">Loading Search Console data…</p>
                                ) : gscError ? (
                                    <p className="text-sm text-red-500">{gscError}</p>
                                ) : gscRows.length === 0 ? (
                                    <p className="text-sm text-gray-400">No data found for this page in the last 28 days.</p>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            <tr>
                                                <th className="pb-2 text-left">Query</th>
                                                <th className="pb-2 text-right">Clicks</th>
                                                <th className="pb-2 text-right">Impressions</th>
                                                <th className="pb-2 text-right">CTR %</th>
                                                <th className="pb-2 text-right">Position</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {gscRows.map((row, i) => (
                                                <tr key={i}>
                                                    <td className="py-2 text-gray-900">{row.query}</td>
                                                    <td className="py-2 text-right text-gray-600">{row.clicks}</td>
                                                    <td className="py-2 text-right text-gray-600">{row.impressions}</td>
                                                    <td className="py-2 text-right text-gray-600">{row.ctr}%</td>
                                                    <td className="py-2 text-right text-gray-600">{row.position}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Save button */}
                    {tab !== 'gsc' && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving…' : 'Save SEO Settings'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
