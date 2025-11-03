import { useState, useEffect } from "react";
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
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import AddLogDialog from "@/components/AddLogDialog";

interface DashboardStats {
  totalEmissions: number;
  ecoScore: number;
  weeklyTrend: number;
}

interface Activity {
  id: number;
  date: string;
  description: string;
  category: string;
  quantity: string;
  emission: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmissions: 0,
    ecoScore: 0,
    weeklyTrend: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userName, setUserName] = useState("User");
  const itemsPerPage = 5;

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name);
    }

    // Fetch dashboard stats
    fetch("http://127.0.0.1:8000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
        // Fallback to default values
        setStats({
          totalEmissions: 0,
          ecoScore: 0,
          weeklyTrend: 0,
        });
      });

    // Fetch activities
    fetch("http://127.0.0.1:8000/api/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setActivities([]);
      });
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

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
                <AvatarFallback>AX</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-8">
            {/* Welcome Banner */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}</h1>
              <p className="text-muted-foreground">Here's your carbon footprint summary.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Emissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalEmissions.toLocaleString()} kg CO₂</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Eco-Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.ecoScore}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Weekly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold ${stats.weeklyTrend < 0 ? 'text-primary' : 'text-destructive'}`}>
                      {stats.weeklyTrend > 0 ? '+' : ''}{stats.weeklyTrend}%
                    </span>
                    {stats.weeklyTrend < 0 ? (
                      <TrendingDown className="h-6 w-6 text-primary" />
                    ) : (
                      <TrendingUp className="h-6 w-6 text-destructive" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activities Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Activities</CardTitle>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Activity
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Distance/Quantity</TableHead>
                      <TableHead className="text-right">CO₂ Emission (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.date}</TableCell>
                        <TableCell>{activity.description}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                            {activity.category}
                          </span>
                        </TableCell>
                        <TableCell>{activity.quantity}</TableCell>
                        <TableCell className="text-right font-medium">{activity.emission.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
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
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
