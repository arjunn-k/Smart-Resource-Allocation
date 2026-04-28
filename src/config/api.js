function normalizeApiBaseUrl(rawValue) {
  const fallbackUrl = 'http://localhost:5000/api';

  if (!rawValue) {
    return fallbackUrl;
  }

  const trimmedUrl = rawValue.trim().replace(/\/+$/, '');

  if (!trimmedUrl) {
    return fallbackUrl;
  }

  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
