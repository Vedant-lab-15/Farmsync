export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch wrapper that automatically handles 401 responses by clearing
 * auth state and redirecting to login — prevents silent failures when
 * the JWT expires.
 */
export const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    // Token expired or invalid — clear storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  return res;
};
