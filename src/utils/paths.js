// Helper for static assets (logos, icons) that live in the frontend 'public' folder
export const getAssetPath = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Clean up 'public/' prefix if present in the data (common mistake)
    let cleanPath = path.startsWith('/') ? path.slice(1) : path;
    if (cleanPath.startsWith('public/')) {
        cleanPath = cleanPath.replace('public/', '');
    }

    // Get base URL from Vite config
    let baseUrl = import.meta.env.VITE_BASE_URL;

    // Ensure base ends with slash
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    // Force /dashboard/ prefix if we are in production and it's missing (failsafe)
    if (import.meta.env.PROD && !cleanBase.includes('/dashboard/')) {
        return `/dashboard/${cleanPath}`;
    }

    return `${cleanBase}${cleanPath}`;
};

// Helper for dynamic uploads (forms, user content) that live on the Backend
export const getBackendUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // Remove leading slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Get API Root
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

// Unified helper that guesses the source based on the path prefix
export const getSmartPath = (path) => {
    if (!path) return '';
    if (path.startsWith('/uploads/') || path.includes('/uploads/') || path.startsWith('uploads/')) {
        return getBackendUrl(path);
    }
    return getAssetPath(path);
};
