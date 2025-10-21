// API service for dashboard data
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Mock data for development
const mockDashboardData = {
  totalEmissions: 1247.5,
  ecoScore: 82,
  activeProjects: 12,
  recentActivities: [
    { id: 1, description: 'Flight to London', category: 'travel', carbon_emission: 450.2, created_at: '2024-01-15' },
    { id: 2, description: 'Weekly groceries', category: 'food', carbon_emission: 67.8, created_at: '2024-01-14' },
    { id: 3, description: 'Electric bill', category: 'energy', carbon_emission: 89.3, created_at: '2024-01-13' },
    { id: 4, description: 'Bus commute', category: 'transport', carbon_emission: 12.1, created_at: '2024-01-12' }
  ],
  emissionTrends: [
    { month: 'Aug', emissions: 1450 },
    { month: 'Sep', emissions: 1320 },
    { month: 'Oct', emissions: 1180 },
    { month: 'Nov', emissions: 980 },
    { month: 'Dec', emissions: 1247 }
  ],
  categoryBreakdown: [
    { category: 'Travel', emissions: 650, percentage: 52 },
    { category: 'Food', emissions: 320, percentage: 26 },
    { category: 'Energy', emissions: 180, percentage: 14 },
    { category: 'Transport', emissions: 97, percentage: 8 }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardAPI = {
  // Get dashboard summary data
  getDashboardData: async () => {
    try {
      // For now, directly return mock data since the backend doesn't have dashboard endpoints
      // In production, this would connect to your FastAPI backend
      await delay(800); // Simulate network delay
      return mockDashboardData;

    } catch (error) {
      console.log('Error with dashboard API:', error);
      // Still return mock data as fallback
      return mockDashboardData;
    }
  },

  // Get user activities
  getActivities: async (skip = 0, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/?skip=${skip}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }

      // Fallback to mock data
      await delay(300);
      return mockDashboardData.recentActivities;

    } catch (error) {
      console.log('Using mock activities data:', error);
      return mockDashboardData.recentActivities;
    }
  },

  // Create new activity
  createActivity: async (activityData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
      });

      if (response.ok) {
        return await response.json();
      }

      throw new Error('Failed to create activity');

    } catch (error) {
      console.error('Error creating activity:', error);
      // For demo purposes, just return the activity data
      return { ...activityData, id: Date.now(), created_at: new Date().toISOString() };
    }
  }
};
