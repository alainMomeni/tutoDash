interface ApiConfig {
  baseURL: string;
  headers: {
    'Content-Type': string;
    Accept: string;
  };
  endpoints: {
    items: (type: string) => string;
    auth: {
      login: string;
      logout: string;
      refresh: string;
    };
    users: {
      me: string;
    };
  };
}

export const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  endpoints: {
    // Update endpoint to match your backend structure
    items: (type: string) => `/items/${type}`, // This will generate /items/product, /items/sales
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh'
    },
    users: {
      me: '/users/me'
    }
  }
};

export const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
  ...API_CONFIG.headers
});