const API_BASE_URL = "http://localhost:8000";

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Add body to config if it exists and method is not GET/HEAD
  if (options.body && !['GET', 'HEAD'].includes(options.method || 'GET')) {
    config.body = options.body;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Token expired or invalid, clear localStorage and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}):`, errorText);
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    signup: (email: string, password: string, full_name: string, confirm_password?: string) =>
      apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ 
          email, 
          password, 
          full_name, 
          confirm_password: confirm_password || password 
        }),
      }),
    me: () => apiRequest("/auth/me"),
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  
  dashboard: {
    stats: () => apiRequest("/api/dashboard/stats"),
    activities: (skip: number = 0, limit: number = 10) => 
      apiRequest(`/api/dashboard/activities?skip=${skip}&limit=${limit}`),
  },

  logs: {
    get: (skip: number = 0, limit: number = 100) => 
      apiRequest(`/api/logs/?skip=${skip}&limit=${limit}`),
    create: (logData: {
      activity_type: string;
      description: string;
      emissions_saved: number;
    }) => 
      apiRequest("/api/logs/", {
        method: "POST",
        body: JSON.stringify(logData),
      }),
    update: (logId: number, logData: {
      activity_type?: string;
      description?: string;
      emissions_saved?: number;
    }) => 
      apiRequest(`/api/logs/${logId}`, {
        method: "PUT",
        body: JSON.stringify(logData),
      }),
    delete: (logId: number) => 
      apiRequest(`/api/logs/${logId}`, {
        method: "DELETE",
      }),
  },

  ai: {
    chat: (message: string) =>
      apiRequest("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
    calculatePoints: (activity: string, category: string, details?: string) =>
      apiRequest("/api/ai/calculate-points", {
        method: "POST",
        body: JSON.stringify({ 
          activity, 
          category,
          details 
        }),
      }),
    testConnection: () => apiRequest("/api/ai/test-connection"),
  },

  insights: {
    weekly: () => apiRequest("/api/insights/weekly"),
    categories: () => apiRequest("/api/insights/categories"),
    summary: () => apiRequest("/api/insights/summary"),
  },

  leaderboard: {
    get: (skip: number = 0, limit: number = 20) => 
      apiRequest(`/api/leaderboard/?skip=${skip}&limit=${limit}`),
  },

  profile: {
    get: () => apiRequest("/api/profile/"),
    update: (profileData: {
      full_name?: string;
      bio?: string;
      avatar_url?: string;
    }) => 
      apiRequest("/api/profile/", {
        method: "PUT",
        body: JSON.stringify(profileData),
      }),
    badges: () => apiRequest("/api/profile/badges"),
    achievements: () => apiRequest("/api/profile/achievements"),
  },
};

// Auth helper functions
export const auth = {
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
  
  getToken: () => {
    return localStorage.getItem("token");
  },
  
  getUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setAuth: (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
  
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};