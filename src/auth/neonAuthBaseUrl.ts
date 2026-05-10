/** Neon Auth base URL (same value as `VITE_NEON_AUTH_URL` in `.env`). Server prefers `NEON_AUTH_BASE_URL`. */
export function neonAuthBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEON_AUTH_BASE_URL) {
    return process.env.NEON_AUTH_BASE_URL.replace(/\/$/, '');
  }
  if (typeof process !== 'undefined' && process.env?.VITE_NEON_AUTH_URL) {
    return process.env.VITE_NEON_AUTH_URL.replace(/\/$/, '');
  }
  const vite = import.meta.env.VITE_NEON_AUTH_URL;
  if (typeof vite === 'string' && vite.length > 0) {
    return vite.replace(/\/$/, '');
  }
  throw new Error(
    'Set NEON_AUTH_BASE_URL or VITE_NEON_AUTH_URL to your Neon Auth URL',
  );
}
