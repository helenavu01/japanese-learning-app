// Base URL of the backend. Empty in dev (Vite proxies /api to localhost:5000).
// Set VITE_API_URL at build time for production (e.g. the Railway URL).
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
