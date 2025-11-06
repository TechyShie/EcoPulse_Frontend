const API_BASE_URL = "https://ecopulse-backend-dev.onrender.com";

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

  console.log(`🔍 API Call: ${options.method || 'GET'} ${endpoint}`);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    console.log(`🔍 API Response: ${response.status} ${endpoint}`);

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: response.statusText };
      }

      // Handle bcrypt password length error specifically
      if (errorData.detail && errorData.detail.includes('bcrypt') && errorData.detail.includes('72')) {
        throw new Error("Password is too long. Please use a shorter password.");
      }

      // Handle other errors
      let errorMessage = `Request failed: ${response.statusText}`;
      
      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((err: any) => err.msg || err.message).join(', ');
      }
      else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
      else if (errorData.message) {
        errorMessage = errorData.message;
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`API Error:`, error);
    throw error;
  }
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
      apiRequest(`/api/logs?skip=${skip}&limit=${limit}`),
    create: (logData: {
      activity_type: string;
      description: string;
      emissions_saved: number;
      points_earned: number;
    }) =>
      apiRequest("/api/logs", { // Fixed: removed trailing slash
        method: "POST",
        body: JSON.stringify(logData),
      }),
    update: (logId: number, logData: {
      activity_type?: string;
      description?: string;
      emissions_saved?: number;
      points_earned?: number;
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
    chat: (prompt: string) => // Fixed: changed 'message' to 'prompt'
      apiRequest("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ prompt }), // Fixed: changed 'message' to 'prompt'
      }),
    // Removed calculatePoints and testConnection - they don't exist in backend
  },

  insights: {
    weekly: () => apiRequest("/api/insights/weekly"),
    categories: () => apiRequest("/api/insights/categories"),
    summary: () => apiRequest("/api/insights/summary"),
  },

  leaderboard: {
    get: (skip: number = 0, limit: number = 20) => 
      apiRequest(`/api/leaderboard?skip=${skip}&limit=${limit}`), // Fixed: removed extra slash
  },

  profile: {
    get: () => apiRequest("/api/profile"),
    update: (profileData: {
      full_name?: string;
      bio?: string;
      avatar?: string; // Fixed: changed 'avatar_url' to 'avatar'
    }) => 
      apiRequest("/api/profile", { // Fixed: removed extra slash
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
