import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Leaf, 
  Activity, 
  Award, 
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { api, auth } from "@/utils/api";

interface WeeklyData {
  date: string;
  emissions_saved: number;
  activity_count: number;
}

interface CategoryData {
  activity_type: string;
  total_emissions: number;
  activity_count: number;
}

interface MonthlySummary {
  monthly_emissions_saved: number;
  monthly_activities: number;
  month: number;
  year: number;
}

const Insights = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  
  // Insights data
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const CATEGORY_COLORS: { [key: string]: string } = {
    transportation: '#0088FE',
    energy: '#00C49F', 
    waste: '#FFBB28',
    food: '#FF8042',
    shopping: '#8884D8'
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      navigate("/auth");
      return;
    }

    // Get user data
    const user = auth.getUser();
    if (user) {
      setUserName(user.full_name || user.email || "User");
    }

    fetchInsightsData();
  }, [navigate]);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all insights data in parallel
      const [weeklyResponse, categoriesResponse, summaryResponse] = await Promise.all([
        api.insights.weekly(),
        api.insights.categories(),
        api.insights.summary()
      ]);

      console.log("Weekly insights:", weeklyResponse);
      console.log("Category insights:", categoriesResponse);
      console.log("Monthly summary:", summaryResponse);

      setWeeklyData(weeklyResponse.daily_data || []);
      setCategoryData(categoriesResponse.categories || []);
      setMonthlySummary(summaryResponse);

    } catch (err: any) {
      console.error("Error fetching insights:", err);
      setError("Failed to load insights data");
      
      // Set empty data as fallback
      setWeeklyData([]);
      setCategoryData([]);
      setMonthlySummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category] || '#6B7280';
  };

  // Calculate totals for summary cards
  const totalEmissions = categoryData.reduce((sum, item) => sum + item.total_emissions, 0);
  const totalActivities = categoryData.reduce((sum, item) => sum + item.activity_count, 0);

  if (loading) {
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
                <p className="mt-4 text-muted-foreground">Loading insights...</p>
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
              
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Insights & Analytics</h1>
                <p className="text-muted-foreground">
                  Deep dive into your environmental impact and trends
                </p>
              </div>
              <Button 
                onClick={fetchInsightsData} 
                variant="outline" 
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={fetchInsightsData}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total CO₂ Saved
                  </CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalEmissions.toFixed(1)} kg
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All-time emissions reduced
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Activities
                  </CardTitle>
                  <Activity className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalActivities}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Eco-friendly actions taken
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    This Month
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {monthlySummary?.monthly_emissions_saved?.toFixed(1) || 0} kg
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {monthlySummary?.monthly_activities || 0} activities
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Insights Tabs */}
            <Tabs defaultValue="weekly" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weekly" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Weekly Trends
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Progress
                </TabsTrigger>
              </TabsList>

              {/* Weekly Trends Tab */}
              <TabsContent value="weekly" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity Trends</CardTitle>
                    <CardDescription>
                      Your eco-activities and emissions saved over the past 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {weeklyData.length === 0 ? (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No data for the past week</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Start logging activities to see your trends
                        </p>
                      </div>
                    ) : (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={formatDate}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => {
                                if (name === 'emissions_saved') return [`${value} kg`, 'CO₂ Saved'];
                                if (name === 'activity_count') return [value, 'Activities'];
                                return [value, name];
                              }}
                              labelFormatter={formatDate}
                            />
                            <Bar 
                              dataKey="emissions_saved" 
                              name="emissions_saved"
                              fill="#10B981" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Weekly Activities Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Activity Count</CardTitle>
                    <CardDescription>
                      Number of eco-activities logged each day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {weeklyData.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No activity data available</p>
                      </div>
                    ) : (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={formatDate}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [value, 'Activities']}
                              labelFormatter={formatDate}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="activity_count" 
                              stroke="#3B82F6"
                              strokeWidth={2}
                              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>
                      How your eco-activities are distributed across categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {categoryData.length === 0 ? (
                      <div className="text-center py-8">
                        <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No category data available</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Log activities in different categories to see the distribution
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ activity_type, percent }) => 
                                  `${activity_type} (${(percent * 100).toFixed(0)}%)`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="total_emissions"
                                nameKey="activity_type"
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={getCategoryColor(entry.activity_type)} 
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value, name, props) => {
                                  if (name === 'total_emissions') return [`${value} kg`, 'CO₂ Saved'];
                                  return [value, name];
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Category Breakdown</h4>
                          {categoryData.map((category, index) => (
                            <div key={category.activity_type} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: getCategoryColor(category.activity_type) }}
                                />
                                <span className="font-medium capitalize">
                                  {category.activity_type}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-green-600">
                                  {category.total_emissions.toFixed(1)} kg
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {category.activity_count} activities
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Totals */}
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg mt-4">
                            <span className="font-semibold">Total</span>
                            <div className="text-right">
                              <div className="font-semibold">
                                {totalEmissions.toFixed(1)} kg
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {totalActivities} activities
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Progress Tab */}
              <TabsContent value="progress" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Progress</CardTitle>
                    <CardDescription>
                      Your environmental impact for {monthlySummary ? 
                      new Date(monthlySummary.year, monthlySummary.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
                      'this month'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!monthlySummary ? (
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No monthly data available</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Your monthly progress will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Leaf className="h-8 w-8 text-green-600" />
                              <div>
                                <div className="font-semibold">CO₂ Saved</div>
                                <div className="text-2xl font-bold text-green-600">
                                  {monthlySummary.monthly_emissions_saved.toFixed(1)} kg
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Activity className="h-8 w-8 text-blue-600" />
                              <div>
                                <div className="font-semibold">Activities</div>
                                <div className="text-2xl font-bold text-blue-600">
                                  {monthlySummary.monthly_activities}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Award className="h-8 w-8 text-orange-600" />
                              <div>
                                <div className="font-semibold">Average per Activity</div>
                                <div className="text-2xl font-bold text-orange-600">
                                  {(monthlySummary.monthly_emissions_saved / monthlySummary.monthly_activities || 0).toFixed(1)} kg
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center p-6">
                          <div className="text-center">
                            <div className="text-6xl font-bold text-green-600 mb-2">
                              {monthlySummary.monthly_emissions_saved.toFixed(0)}
                            </div>
                            <div className="text-lg font-semibold">kg CO₂ Saved</div>
                            <div className="text-muted-foreground mt-2">
                              This is equivalent to planting about{' '}
                              <span className="font-semibold">
                                {Math.round(monthlySummary.monthly_emissions_saved / 21)} trees
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Insights;