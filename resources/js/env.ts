// env.ts
// Utility to get environment-based URLs for cross-project navigation

const getBaseDomain = (): string => {
    const env = import.meta.env.VITE_SERVER_ENV || import.meta.env.MODE;
    if (env === 'production') return 'graveyardjokes.com';
    if (env === 'test' || env === 'testing') return 'graveyardjokes.test';
    return 'graveyardjokes.local';
};

const localPorts = {
    '': '8000',
    studio: '8003',
};

const getProtocol = (): string => {
    const domain = getBaseDomain();
    return domain === 'graveyardjokes.local' || domain === 'graveyardjokes.test' ? 'http' : 'https';
};

export const getMainSiteUrl = (): string => {
    const domain = getBaseDomain();
    const port = domain === 'graveyardjokes.local' ? localPorts[''] : '';

    return `${getProtocol()}://${domain}${port ? `:${port}` : ''}`;
};

export const getProjectUrl = (subdomain: string): string => {
    const domain = getBaseDomain();
    const port = domain === 'graveyardjokes.local' ? localPorts[subdomain] ?? '' : '';

    return `${getProtocol()}://${subdomain}.${domain}${port ? `:${port}` : ''}`;
};
