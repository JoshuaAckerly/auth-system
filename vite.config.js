import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    let server;
    if (env.VITE_SERVER_ENV === 'production') {
        server = {
            port: 443,
            host: '0.0.0.0',
            origin: 'https://auth-system.graveyardjokes.com',
            allowedHosts: ['auth-system.graveyardjokes.com'],
        };
    } else if (env.VITE_SERVER_ENV === 'test' || env.VITE_SERVER_ENV === 'testing') {
        server = {
            port: 8088,
            host: '127.0.0.1',
            origin: 'http://auth-system.graveyardjokes.testing:8088',
            allowedHosts: ['auth-system.graveyardjokes.testing'],
        };
    } else {
        // default: local/development
        server = {
            port: 8088,
            host: '0.0.0.0',
            origin: 'http://auth-system.graveyardjokes.local:8088',
            cors: {
                origin: [
                    'http://auth-system.graveyardjokes.local',
                    'http://auth-system.graveyardjokes.local:8007',
                    'http://localhost:8007',
                ],
                credentials: true
            },
            allowedHosts: ['auth-system.graveyardjokes.local'],
        };
    }

    return {
        server,
        define: {
            __INERTIA_SSR_PORT__: JSON.stringify(env.INERTIA_SSR_PORT || ''),
            __INERTIA_SSR_URL__: JSON.stringify(env.INERTIA_SSR_URL || ''),
        },
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                ssr: 'resources/js/ssr.jsx',
                refresh: true,
            }),
            react(),
        ],
        resolve: {
            alias: {
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
            dedupe: ['react', 'react-dom'],
        },
        ssr: {
            noExternal: ['react', 'react-dom', '@inertiajs/react', '@inertiajs/core'],
        },
    };
});
