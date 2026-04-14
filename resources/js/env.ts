// env.ts
// Utility to get environment-based URLs for cross-project navigation

const getBaseDomain = (): string => {
    const env = import.meta.env.VITE_SERVER_ENV || import.meta.env.MODE;
    if (env === 'production') return 'graveyardjokes.com';
    if (env === 'test' || env === 'testing') return 'graveyardjokes.test';
    return 'graveyardjokes.local';
};

const getProtocol = (): string => {
    const domain = getBaseDomain();
    return domain === 'graveyardjokes.local' || domain === 'graveyardjokes.test' ? 'http' : 'https';
};

export const getMainSiteUrl = (): string => `${getProtocol()}://${getBaseDomain()}`;
export const getProjectUrl = (subdomain: string): string => `${getProtocol()}://${subdomain}.${getBaseDomain()}`;
