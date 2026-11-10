import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        host: true,          // listen on 0.0.0.0 so the browser can reach the container
        port: 5173,
        strictPort: true,   // fail if port 5173 is already in use
        watch: {
            usePolling: true,  // file events don't cross Docker bind mounts reliably
            interval: 300,
        },
        proxy: {
            // Browser calls /api/v1/... on port 5173; Vite forwards them to Express.
            '/api': { target: 'http://localhost:5000', changeOrigin: true },
        },
    },
});