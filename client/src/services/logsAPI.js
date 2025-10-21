// API service for activity logs
const API_BASE_URL = 'http://localhost:8000';

// Mock data for development
const mockLogs = [
  {
    id: 1,
    date: '2024-01-15',
    description: 'Flight from Nairobi to London',
    category: 'travel',
    carbon_emission: 1247.5,
    notes: 'Business trip for conference',
    location: 'London, UK',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    date: '2024-01-14',
    description: 'Weekly grocery shopping',
    category: 'food',
    carbon_emission: 67.8,
    notes: 'Organic produce and local items',
    location: 'Local Market',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    date: '2024-01-13',
    description: 'Monthly electricity bill',
    category: 'energy',
    carbon_emission: 89.3,
    notes: 'Mixed renewable and grid energy',
    location: 'Home',
    created_at: '2024-01-13T09:00:00Z',
    updated_at: '2024-01-13T09:00:00Z'
  },
  {
    id: 4,
    date: '2024-01-12',
    description: 'Bus commute to work',
    category: 'transport',
    carbon_emission: 12.1,
    notes: 'Public transport instead of driving',
    location: 'Nairobi',
    created_at: '2024-01-12T08:15:00Z',
    updated_at: '2024-01-12T08:15:00Z'
  },
  {
    id: 5,
    date: '2024-01-11',
    description: 'Restaurant dinner',
    category: 'food',
    carbon_emission: 45.2,
    notes: 'Vegetarian options chosen',
    location: 'Downtown Restaurant',
    created_at: '2024-01-11T19:45:00Z',
    updated_at: '2024-01-11T19:45:00Z'
  },
  {
    id: 6,
    date: '2024-01-10',
    description: 'Online shopping delivery',
    category: 'transport',
    carbon_emission: 23.7,
    notes: 'Package delivery from online retailer',
    location: 'Home',
    created_at: '2024-01-10T16:30:00Z',
    updated_at: '2024-01-10T16:30:00Z'
  },
  {
    id: 7,
    date: '2024-01-09',
    description: 'Movie night at cinema',
    category: 'energy',
    carbon_emission: 8.5,
    notes: 'Electricity usage for movie theater',
    location: 'Cinema Complex',
    created_at: '2024-01-09T20:15:00Z',
    updated_at: '2024-01-09T20:15:00Z'
  },
  {
    id: 8,
    date: '2024-01-08',
    description: 'Car maintenance',
    category: 'transport',
    carbon_emission: 15.2,
    notes: 'Oil change and tire rotation',
    location: 'Auto Service Center',
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-08T11:00:00Z'
  }
];

// Mock categories for development
const mockCategories = [
  { id: 1, value: 'travel', label: '✈️ Travel', color: '#059669' },
  { id: 2, value: 'food', label: '🍽️ Food', color: '#10b981' },
  { id: 3, value: 'energy', label: '⚡ Energy', color: '#34d399' },
  { id: 4, value: 'transport', label: '🚗 Transport', color: '#6ee7b7' },
  { id: 5, value: 'waste', label: '🗑️ Waste', color: '#84cc16' },
  { id: 6, value: 'water', label: '💧 Water', color: '#06b6d4' }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to filter and paginate logs
const filterAndPaginateLogs = (logs, params) => {
  let filteredLogs = [...logs];

  // Apply category filter
  if (params.category && params.category !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.category === params.category);
  }

  // Apply search filter
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredLogs = filteredLogs.filter(log =>
      log.description.toLowerCase().includes(searchTerm) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm)) ||
      (log.location && log.location.toLowerCase().includes(searchTerm))
    );
  }

  // Apply date filters
  if (params.dateFrom) {
    filteredLogs = filteredLogs.filter(log => log.date >= params.dateFrom);
  }
  if (params.dateTo) {
    filteredLogs = filteredLogs.filter(log => log.date <= params.dateTo);
  }

  // Apply sorting
  const sortBy = params.sortBy || 'date';
  const sortOrder = params.sortOrder || 'desc';
  filteredLogs.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (sortOrder === 'desc') {
      return bVal > aVal ? 1 : -1;
    } else {
      return aVal > bVal ? 1 : -1;
    }
  });

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  return {
    logs: paginatedLogs,
    pagination: {
      page,
      limit,
      total: filteredLogs.length,
      totalPages: Math.ceil(filteredLogs.length / limit),
      hasNext: endIndex < filteredLogs.length,
      hasPrev: page > 1
    }
  };
};

export const logsAPI = {
  // Get all activity logs with filtering and pagination
  getLogs: async (params = {}) => {
    try {
      // For development, use mock data with simulated API behavior
      await delay(500);

      const result = filterAndPaginateLogs(mockLogs, params);
      return result;

    } catch (error) {
      console.error('Error fetching logs:', error);
      // Fallback to basic mock data
      await delay(300);
      return {
        logs: mockLogs.slice(0, 10),
        pagination: {
          page: 1,
          limit: 10,
          total: mockLogs.length,
          totalPages: Math.ceil(mockLogs.length / 10)
        }
      };
    }
  },

  // Get a single log by ID
  getLogById: async (logId) => {
    try {
      await delay(300);
      const log = mockLogs.find(log => log.id === parseInt(logId));
      if (log) {
        return log;
      }
      throw new Error('Log not found');

    } catch (error) {
      console.error('Error fetching log:', error);
      return null;
    }
  },

  // Create a new activity log
  createLog: async (logData) => {
    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/logs/`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(logData)
      // });
      // return await response.json();

      await delay(800); // Simulate API delay

      // For development, create mock log
      const newLog = {
        ...logData,
        id: Math.max(...mockLogs.map(log => log.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockLogs.unshift(newLog); // Add to beginning of array
      return newLog;

    } catch (error) {
      console.error('Error creating log:', error);
      throw error;
    }
  },

  // Update an existing activity log
  updateLog: async (logId, logData) => {
    try {
      await delay(600); // Simulate API delay

      const logIndex = mockLogs.findIndex(log => log.id === parseInt(logId));
      if (logIndex === -1) {
        throw new Error('Log not found');
      }

      // Update the log
      const updatedLog = {
        ...mockLogs[logIndex],
        ...logData,
        updated_at: new Date().toISOString()
      };

      mockLogs[logIndex] = updatedLog;
      return updatedLog;

    } catch (error) {
      console.error('Error updating log:', error);
      throw error;
    }
  },

  // Delete an activity log
  deleteLog: async (logId) => {
    try {
      await delay(400); // Simulate API delay

      const logIndex = mockLogs.findIndex(log => log.id === parseInt(logId));
      if (logIndex === -1) {
        throw new Error('Log not found');
      }

      mockLogs.splice(logIndex, 1);
      return { success: true, message: 'Log deleted successfully' };

    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  },

  // Get available categories
  getCategories: async () => {
    try {
      await delay(300);
      return mockCategories;

    } catch (error) {
      console.error('Error fetching categories:', error);
      return mockCategories; // Return default categories as fallback
    }
  },

  // Get logs summary/statistics
  getLogsSummary: async (params = {}) => {
    try {
      await delay(400);

      let filteredLogs = [...mockLogs];

      // Apply same filters as getLogs
      if (params.category && params.category !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.category === params.category);
      }

      if (params.dateFrom) {
        filteredLogs = filteredLogs.filter(log => log.date >= params.dateFrom);
      }
      if (params.dateTo) {
        filteredLogs = filteredLogs.filter(log => log.date <= params.dateTo);
      }

      const totalEmissions = filteredLogs.reduce((sum, log) => sum + log.carbon_emission, 0);
      const averageEmission = filteredLogs.length > 0 ? totalEmissions / filteredLogs.length : 0;

      return {
        totalLogs: filteredLogs.length,
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        averageEmission: Math.round(averageEmission * 100) / 100,
        categoryBreakdown: mockCategories.map(category => {
          const categoryLogs = filteredLogs.filter(log => log.category === category.value);
          return {
            ...category,
            count: categoryLogs.length,
            emissions: categoryLogs.reduce((sum, log) => sum + log.carbon_emission, 0)
          };
        }).filter(cat => cat.count > 0)
      };

    } catch (error) {
      console.error('Error fetching logs summary:', error);
      return {
        totalLogs: 0,
        totalEmissions: 0,
        averageEmission: 0,
        categoryBreakdown: []
      };
    }
  }
};
