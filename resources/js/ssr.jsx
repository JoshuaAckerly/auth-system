import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const fallbackSsrPortFromBuild = __INERTIA_SSR_PORT__;
const fallbackSsrUrlFromBuild = __INERTIA_SSR_URL__;

const resolveSsrPort = () => {
    const explicitPort = Number.parseInt(process.env.INERTIA_SSR_PORT ?? fallbackSsrPortFromBuild ?? '', 10);

    if (Number.isInteger(explicitPort) && explicitPort > 0) {
        return explicitPort;
    }

    const ssrUrl = process.env.INERTIA_SSR_URL ?? fallbackSsrUrlFromBuild;

    if (ssrUrl) {
        try {
            const parsedPort = Number.parseInt(new URL(ssrUrl).port, 10);

            if (Number.isInteger(parsedPort) && parsedPort > 0) {
                return parsedPort;
            }
        } catch {
            // Use default fallback when INERTIA_SSR_URL is malformed.
        }
    }

    return 13714;
};

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx'),
            ),
        setup: ({ App, props }) => {
            const ziggy = page?.props?.ziggy;

            // Provide route() during SSR for components that render links/forms server-side.
            global.route = (name, params, absolute) => {
                if (!ziggy || !ziggy.location) {
                    return '#';
                }

                return route(name, params, absolute, {
                    ...ziggy,
                    location: new URL(ziggy.location),
                });
            };

            return <App {...props} />;
        },
    }),
    resolveSsrPort(),
);
