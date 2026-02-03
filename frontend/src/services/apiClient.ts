const API_URL = import.meta.env.VITE_API_URL;

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
}

export const clearAuthToken = () => {
  authToken = null
}

async function apiRequest<T>(endpoint: string, method: string, body?: any, token?: string | null): Promise<T> {

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // correct one
    headers['token'] = token; // current one
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default apiRequest;