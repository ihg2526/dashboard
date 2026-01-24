const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
    fetchTeams: async () => {
        const response = await fetch(`${API_URL}/teams?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        return response.json();
    },

    fetchStandings: async () => {
        const response = await fetch(`${API_URL}/standings?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch standings');
        return response.json();
    },

    fetchFixtures: async () => {
        const response = await fetch(`${API_URL}/fixtures?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch fixtures');
        return response.json();
    },

    fetchMetadata: async () => {
        const response = await fetch(`${API_URL}/metadata?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch metadata');
        return response.json();
    },

    fetchInitialData: async () => {
        const response = await fetch(`${API_URL}/initial-data?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch initial data');
        return response.json();
    },

    fetchForms: async () => {
        const response = await fetch(`${API_URL}/forms?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch forms');
        return response.json();
    },

    uploadForm: async (formData) => {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders()
            },
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload form');
        return response.json();
    },

    deleteForm: async (id) => {
        const response = await fetch(`${API_URL}/forms/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders()
            }
        });
        if (!response.ok) throw new Error('Failed to delete form');
        return response.json();
    },

    addResults: async (newResults) => {
        const response = await fetch(`${API_URL}/fixtures`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(newResults)
        });
        if (!response.ok) throw new Error('Failed to add results');
        return response.json();
    },

    saveStandings: async (standings) => {
        const response = await fetch(`${API_URL}/standings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(standings)
        });
        if (!response.ok) throw new Error('Failed to save standings');
        return response.json();
    },

    login: async (password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    }
};
