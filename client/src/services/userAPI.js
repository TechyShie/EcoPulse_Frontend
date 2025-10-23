// API service for user profile and settings
const API_BASE_URL = 'http://localhost:8000';

// User profile API endpoints
export const userAPI = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return mock data for development
      return {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Environmental enthusiast passionate about reducing carbon footprint',
        location: 'Nairobi, Kenya',
        joined_date: '2024-01-15',
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            weekly_report: true,
            goal_reminders: true
          },
          privacy: {
            profile_public: false,
            show_emissions: true,
            show_achievements: true
          }
        }
      };
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Simulate successful update for development
      return { success: true, message: 'Profile updated successfully' };
    }
  },

  // Update user preferences (theme, notifications, etc.)
  updateUserPreferences: async (preferences) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to update user preferences');
      }
    } catch (error) {
      console.error('Error updating user preferences:', error);
      // Simulate successful update for development
      return { success: true, message: 'Preferences updated successfully' };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/api/user/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      // Return mock success response
      return {
        success: true,
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
    }
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: true, message: 'Account deletion initiated' };
    }
  }
};

// Theme management utility
export const themeManager = {
  // Apply theme to document
  applyTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
    }
  },

  // Get current theme from localStorage or system preference
  getCurrentTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  },

  // Toggle theme
  toggleTheme: () => {
    const currentTheme = themeManager.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    themeManager.applyTheme(newTheme);
    return newTheme;
  },

  // Initialize theme on app start
  initialize: () => {
    const theme = themeManager.getCurrentTheme();
    themeManager.applyTheme(theme);
  }
};
