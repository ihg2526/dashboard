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

export const getBackendUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // Remove leading slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Get API Root
    // If VITE_API_URL is set (e.g. https://backend.com/api), we want the origin (https://backend.com)
    // because uploads are at /uploads (not /api/uploads)
    const apiEnv = import.meta.env.VITE_API_URL;

    if (apiEnv && apiEnv.startsWith('http')) {
        try {
            const url = new URL(apiEnv);
            // Result: https://backend.com + / + uploads/file.pdf
            return `${url.origin}/${cleanPath}`;
        } catch (e) {
            console.error("Invalid API URL", e);
            return path;
        }
    }

    // Fallback for dev (proxy) or relative API
    return `/${cleanPath}`;
};
