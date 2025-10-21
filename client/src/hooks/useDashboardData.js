import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/dashboardAPI';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard data...');
      const data = await dashboardAPI.getDashboardData();
      console.log('Dashboard data received:', data);
      setDashboardData(data);
    } catch (err) {
      console.error('Error in useDashboardData:', err);
      setError(err.message);
      // Still set some default data to prevent empty dashboard
      setDashboardData({
        totalEmissions: 0,
        ecoScore: 0,
        activeProjects: 0,
        recentActivities: [],
        emissionTrends: [],
        categoryBreakdown: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { dashboardData, loading, error, refetch: fetchDashboardData };
};
