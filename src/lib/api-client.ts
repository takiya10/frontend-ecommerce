const getApiUrl = () => {
  // Priority 1: Environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  // Priority 2: Default to localhost:3000
  return 'http://localhost:3000';
};

const API_URL = getApiUrl();
console.log("Byher API Client initialized with URL:", API_URL);

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Decide which token to use
  let token = localStorage.getItem('access_token');
  if (cleanEndpoint.startsWith('/admin') || cleanEndpoint.startsWith('/settings')) {
    const adminToken = localStorage.getItem('admin_access_token');
    if (adminToken) token = adminToken;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  // If body is FormData, let browser set Content-Type with boundary
  if (options?.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${API_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!res.ok) {
      // Global 401 Interceptor: Auto-logout if token is invalid/expired
      if (res.status === 401) {
        console.warn("Unauthorized access detected. Clearing session.");

        // Determine context based on endpoint to clear correct session
        if (cleanEndpoint.startsWith('/admin') || cleanEndpoint.startsWith('/settings') || cleanEndpoint.startsWith('/upload')) {
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_user_data');
          // Optional: Redirect to admin login if strictly needed, 
          // but often allowing the UI to react to the cleared token is smoother.
          // window.location.href = '/byher-internal-mgmt/login';
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          // window.location.href = '/login';
        }

        // We still throw the error so the UI component knows the request failed
      }

      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Fetcher encountered an error at ${fullUrl}:`, error);
    throw error;
  }
}