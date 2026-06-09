import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` configurable pour GitHub Pages :
//   - racine (domaine perso / user.github.io) : '/'
//   - "project page" (user.github.io/le-pass-78/) : '/le-pass-78/'
// Défini via la variable d'env VITE_BASE au build (voir workflow GitHub Actions).
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  server: { host: true, port: 5174 },
  preview: { host: true, port: 5174 },
  plugins: [react()],
});
