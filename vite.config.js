import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

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
            host: '10.0.1.30',
            origin: 'http://auth-system.graveyardjokes.local:8088',
            cors: {
                origin: 'http://auth-system.graveyardjokes.local',
                credentials: true
            },
            allowedHosts: ['auth-system.graveyardjokes.local'],
        };
    }

    return {
        server,
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
    };
});
