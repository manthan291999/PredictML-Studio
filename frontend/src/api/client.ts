const API_BASE_URL = 'http://localhost:8001/api';

export class ApiError extends Error {
  status: number;
  message: string;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let details;
      try {
        details = await response.json();
      } catch {
        details = null;
      }
      throw new ApiError(response.status, `API Request failed: ${response.statusText}`, details);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : 'Network failure occurred');
  }
}
