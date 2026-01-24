import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
    return {
        plugins: [react()],
        base: mode === 'production' ? '/dashboard/' : '/',
        server: {
            port: 3000,
            proxy: {
                '/api': 'https://ihg-dashboard.onrender.com',
                '/uploads': 'https://ihg-dashboard.onrender.com'
            }
        }
    };
});
