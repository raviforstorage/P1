import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only proxy so the React app can call /api/... on localhost without
// CORS friction while the Express server runs separately on port 5000.
// In production, VITE_API_URL points straight at the deployed backend
// instead, so this proxy block is not used.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
