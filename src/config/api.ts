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
  baseURL: 'https://backend-station-app-demo.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  endpoints: {
    items: (type: string) => `/items/${type}`,
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
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});