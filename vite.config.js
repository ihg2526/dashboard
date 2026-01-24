import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/dashboard/',
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:3001',
            '/uploads': 'http://localhost:3001'
        }
    }
});
