import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, Activity, Award, Leaf, RefreshCw, AlertCircle } from "lucide-react";
import AddLogDialog from "@/components/AddLogDialog";
import { api, auth } from "@/utils/api";

interface DashboardStats {
  total_emissions_saved: number;
  eco_score: number;
  weekly_emissions_saved: number;  // Updated to match backend
  weekly_activity_count: number;   // Updated to match backend
  user_rank: string;               // Added from backend
}

interface Activity {
  id: number;
  activity_type: string;
  description: string;
  emissions_saved: number;
  points_earned: number;
  activity_date: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      navigate("/auth");
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Fetching dashboard data...");

      // Fetch user data first to get the name
      const userData = await api.auth.me();
      console.log("👤 User data:", userData);
      
      // Set user name
      if (userData.full_name) {
        setUserName(userData.full_name);
      } else if (userData.username) {
        setUserName(userData.username);
      } else if (userData.email) {
        setUserName(userData.email.split('@')[0]);
      }

      // Fetch dashboard stats and activities in parallel
      const [statsData, activitiesData] = await Promise.all([
        api.dashboard.stats(),
        api.dashboard.activities(0, 10)
      ]);

      console.log("📊 Dashboard stats:", statsData);
      console.log("📝 Activities data:", activitiesData);

      setStats(statsData);
      
      // Ensure activities is an array
      if (Array.isArray(activitiesData)) {
        setActivities(activitiesData);
      } else {
        console.error("❌ Activities data is not an array:", activitiesData);
        setActivities([]);
      }

    } catch (err: any) {
      console.error("❌ Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleAddLog = (newLog: any) => {
    console.log("➕ Adding new log:", newLog);
    
    // Add new log to the beginning of activities list
    setActivities(prev => [newLog, ...prev]);
    
    // Update stats optimistically - use the correct field names
    if (stats) {
      setStats(prev => prev ? {
        ...prev,
        total_emissions_saved: prev.total_emissions_saved + newLog.emissions_saved,
        weekly_emissions_saved: prev.weekly_emissions_saved + newLog.emissions_saved,
        weekly_activity_count: prev.weekly_activity_count + 1,
        eco_score: prev.eco_score + newLog.points_earned
      } : null);
    }

    // Refresh data to ensure consistency
    setTimeout(() => {
      fetchDashboardData();
    }, 1000);
  };

  // Calculate user rank based on eco_score
  const getUserRank = (score: number) => {
    if (score >= 200) return "Eco Champion";
    if (score >= 100) return "Eco Warrior";
    if (score >= 50) return "Eco Enthusiast";
    return "Eco Beginner";
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const formatEmissions = (emissions: number | undefined) => {
    if (emissions === undefined || emissions === null) {
      return "0";
    }
    return emissions.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  const formatActivityType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading && !refreshing) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-6">
                <SidebarTrigger />
                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top Header with Trigger */}
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <SidebarTrigger />
              
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-8">
            {/* Welcome Banner */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}</h1>
              <p className="text-muted-foreground">
                {stats ? `You're ranked as ${stats.user_rank || getUserRank(stats.eco_score)}` : "Track your environmental impact"}
              </p>
            </div>

            {error && (
              <div className="bg-destructive/15 border border-destructive/50 text-destructive p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error</span>
                </div>
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={fetchDashboardData}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total CO₂ Saved
                  </CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? formatEmissions(stats.total_emissions_saved) : "0"} kg
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime emissions reduced
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Eco-Score
                  </CardTitle>
                  <Award className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {stats ? stats.eco_score : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats ? (stats.user_rank || getUserRank(stats.eco_score)) : "Your sustainability score"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Weekly Progress
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? formatEmissions(stats.weekly_emissions_saved) : "0"} kg
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This week's savings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Weekly Activities
                  </CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? stats.weekly_activity_count : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activities</CardTitle>
                  <div className="flex items-center gap-2">
                    <AddLogDialog onAddLog={handleAddLog} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No activities yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your first eco-friendly activity to start tracking your impact!
                    </p>
                    <AddLogDialog onAddLog={handleAddLog} />
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">CO₂ Saved (kg)</TableHead>
                          <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">
                              {new Date(activity.activity_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {activity.description}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary capitalize">
                                {formatActivityType(activity.activity_type)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              +{activity.emissions_saved.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-blue-600">
                              +{activity.points_earned}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {activities.length > itemsPerPage && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, activities.length)} of {activities.length} activities
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;