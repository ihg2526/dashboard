import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
    return {
        plugins: [react()],
        base: mode === 'production' ? '/dashboard/' : '/',
        server: {
            port: 3000,
            proxy: {
                '/api': 'http://219.70.120.85:3001',
                '/uploads': 'http://219.70.120.85:3001'
            }
        }
    };
});
