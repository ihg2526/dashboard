import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    base: mode === 'production' ? '/dashboard/' : '/',
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:3001',
            '/uploads': 'http://localhost:3001'
        }
    }
}));
