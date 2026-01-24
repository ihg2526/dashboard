export const getAssetPath = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Remove leading slash if present to avoid double slashes when joining
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Get base URL (defaults to '/' in dev, '/dashboard/' in prod per vite config)
    const baseUrl = import.meta.env.BASE_URL;

    // Ensure base ends with slash
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    return `${cleanBase}${cleanPath}`;
};
