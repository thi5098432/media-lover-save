// API client para deploy independente (substitui chamadas do Supabase)

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

async function apiCall<T>(endpoint: string, body?: object): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: new Error(data.error || 'Erro na requisição') };
    }

    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Erro desconhecido') 
    };
  }
}

export const api = {
  functions: {
    invoke: async <T = any>(functionName: string, options?: { body?: object }): Promise<ApiResponse<T>> => {
      return apiCall<T>(functionName, options?.body);
    }
  },
  
  // Método para streaming (download-hls, stream-media)
  stream: async (endpoint: string, body: object): Promise<Response> => {
    return fetch(`${API_BASE_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  },

  // URL base para construir URLs de streaming
  getStreamUrl: (endpoint: string) => `${API_BASE_URL}/api/${endpoint}`,
};

export default api;
