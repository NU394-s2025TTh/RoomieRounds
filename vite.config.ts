/// <reference types="vitest" />s
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  test: { globals: true, environment: 'jsdom' },
  plugins: [react(), tailwindcss()],
});
