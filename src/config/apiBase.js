// Base URL of the backend. Set REACT_APP_BACKEND_URL at build time (see .env.production).
export const API_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');
