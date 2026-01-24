import staticDb from '../staticDb.json';

const IS_PROD = import.meta.env.PROD;
// Use relative path for proxy to work in Dev, and staticDb in Prod
const API_URL = '/api';

export const api = {
    fetchTeams: async () => {
        if (IS_PROD) return Promise.resolve(staticDb.teams);
        const response = await fetch(`${API_URL}/teams?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        return response.json();
    },

    fetchStandings: async () => {
        if (IS_PROD) return Promise.resolve(staticDb.standings || []);
        const response = await fetch(`${API_URL}/standings?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch standings');
        return response.json();
    },

    fetchFixtures: async () => {
        if (IS_PROD) return Promise.resolve(staticDb.fixtures);
        const response = await fetch(`${API_URL}/fixtures?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch fixtures');
        return response.json();
    },

    fetchMetadata: async () => {
        if (IS_PROD) return Promise.resolve(staticDb.metadata);
        const response = await fetch(`${API_URL}/metadata?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch metadata');
        return response.json();
    },

    fetchInitialData: async () => {
        if (IS_PROD) {
            return Promise.resolve({
                teams: staticDb.teams,
                fixtures: staticDb.fixtures,
                sports: staticDb.metadata.sports,
                genders: staticDb.metadata.genders,
                standings: staticDb.standings || []
            });
        }
        const response = await fetch(`${API_URL}/initial-data?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch initial data');
        return response.json();
    },

    fetchForms: async () => {
        if (IS_PROD) return Promise.resolve(staticDb.forms || []);
        const response = await fetch(`${API_URL}/forms?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch forms');
        return response.json();
    },

    uploadForm: async (formData) => {
        if (IS_PROD) {
            console.warn("Uploading forms is disabled in production mode.");
            return;
        }
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload form');
        return response.json();
    },

    deleteForm: async (id) => {
        if (IS_PROD) {
            console.warn("Deleting forms is disabled in production mode.");
            return;
        }
        const response = await fetch(`${API_URL}/forms/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete form');
        return response.json();
    },

    addResults: async (newResults) => {
        if (IS_PROD) {
            console.warn("Adding results is disabled in production mode.");
            return;
        }
        const response = await fetch(`${API_URL}/fixtures`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newResults)
        });
        if (!response.ok) throw new Error('Failed to add results');
        return response.json();
    },

    saveStandings: async (standings) => {
        if (IS_PROD) {
            console.warn("Saving standings is disabled in production mode.");
            return;
        }
        const response = await fetch(`${API_URL}/standings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(standings)
        });
        if (!response.ok) throw new Error('Failed to save standings');
        return response.json();
    },

    publishData: async () => {
        if (IS_PROD) throw new Error("Cannot publish from production build");
        const response = await fetch(`${API_URL}/publish`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to publish data');
        return response.json();
    }
};
