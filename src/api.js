export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
export const FILES_URL = API_URL.replace(/\/api$/, '')
